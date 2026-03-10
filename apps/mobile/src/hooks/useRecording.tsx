import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export type RecordingStatus =
  | 'idle'
  | 'requesting_permission'
  | 'ready'
  | 'recording'
  | 'paused'
  | 'stopped'
  | 'playing';

interface UseRecordingOptions {
  maxDurationSec?: number;
  onRecordingComplete?: (uri: string, durationSec: number) => void;
}

interface UseRecordingReturn {
  status: RecordingStatus;
  durationSec: number;
  recordingUri: string | null;
  error: string | null;
  startRecording: () => Promise<void>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  playRecording: () => Promise<void>;
  stopPlayback: () => Promise<void>;
  resetRecording: () => void;
}

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

export function useRecording(options: UseRecordingOptions = {}): UseRecordingReturn {
  const { maxDurationSec = 300, onRecordingComplete } = options;

  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [durationSec, setDurationSec] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);
  const permissionGrantedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const unloadSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
  }, []);

  const unloadRecording = useCallback(async () => {
    if (recordingRef.current) {
      try {
        const recStatus = await recordingRef.current.getStatusAsync();
        if (recStatus.isRecording) {
          await recordingRef.current.stopAndUnloadAsync();
        } else {
          await recordingRef.current._cleanupForUnloadedRecorder();
        }
      } catch {
        // Already unloaded
      }
      recordingRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (permissionGrantedRef.current) return true;

    setStatus('requesting_permission');
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      permissionGrantedRef.current = granted;
      if (!granted) {
        setError('Microphone permission is required to record');
        setStatus('idle');
        return false;
      }
      return true;
    } catch (e) {
      setError('Failed to request microphone permission');
      setStatus('idle');
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      await unloadSound();
      await unloadRecording();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(RECORDING_OPTIONS);
      await recording.startAsync();

      recordingRef.current = recording;
      setRecordingUri(null);
      setDurationSec(0);
      accumulatedRef.current = 0;
      startTimeRef.current = Date.now();
      setStatus('recording');

      timerRef.current = setInterval(() => {
        const elapsed = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000;
        const rounded = Math.round(elapsed * 10) / 10;
        setDurationSec(rounded);

        if (rounded >= maxDurationSec) {
          // Auto-stop — call stopRecording async
          stopRecordingInternal();
        }
      }, 100);
    } catch (e: any) {
      setError(e?.message || 'Failed to start recording');
      setStatus('idle');
    }
  }, [maxDurationSec, requestPermission, unloadSound, unloadRecording]);

  const stopRecordingInternal = useCallback(async () => {
    clearTimer();
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      const finalDuration = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000;
      const roundedDuration = Math.round(finalDuration);

      setDurationSec(roundedDuration);
      setRecordingUri(uri);
      setStatus('stopped');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      if (uri && onRecordingComplete) {
        onRecordingComplete(uri, roundedDuration);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to stop recording');
      setStatus('idle');
    }
  }, [clearTimer, onRecordingComplete]);

  const stopRecording = useCallback(async () => {
    await stopRecordingInternal();
  }, [stopRecordingInternal]);

  const pauseRecording = useCallback(async () => {
    if (!recordingRef.current || status !== 'recording') return;

    try {
      clearTimer();
      accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
      await recordingRef.current.pauseAsync();
      setStatus('paused');
    } catch (e: any) {
      setError(e?.message || 'Failed to pause recording');
    }
  }, [status, clearTimer]);

  const resumeRecording = useCallback(async () => {
    if (!recordingRef.current || status !== 'paused') return;

    try {
      await recordingRef.current.startAsync();
      startTimeRef.current = Date.now();
      setStatus('recording');

      timerRef.current = setInterval(() => {
        const elapsed = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000;
        const rounded = Math.round(elapsed * 10) / 10;
        setDurationSec(rounded);

        if (rounded >= maxDurationSec) {
          stopRecordingInternal();
        }
      }, 100);
    } catch (e: any) {
      setError(e?.message || 'Failed to resume recording');
    }
  }, [status, maxDurationSec, stopRecordingInternal]);

  const playRecording = useCallback(async () => {
    if (!recordingUri) return;

    try {
      await unloadSound();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true },
      );
      soundRef.current = sound;
      setStatus('playing');

      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
          setStatus('stopped');
        }
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to play recording');
      setStatus('stopped');
    }
  }, [recordingUri, unloadSound]);

  const stopPlayback = useCallback(async () => {
    await unloadSound();
    setStatus('stopped');
  }, [unloadSound]);

  const resetRecording = useCallback(() => {
    clearTimer();
    unloadSound();
    unloadRecording();

    // Delete temp file
    if (recordingUri) {
      FileSystem.deleteAsync(recordingUri, { idempotent: true }).catch(() => {});
    }

    setStatus('ready');
    setDurationSec(0);
    setRecordingUri(null);
    setError(null);
    accumulatedRef.current = 0;
  }, [clearTimer, unloadSound, unloadRecording, recordingUri]);

  // Initialize to ready
  useEffect(() => {
    setStatus('ready');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, [clearTimer]);

  return {
    status,
    durationSec,
    recordingUri,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    resetRecording,
  };
}
