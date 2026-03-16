import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressProvider, useProgress } from '../../src/hooks/useProgress';

// Helper component to test the hook
function TestConsumer({ onReady }: { onReady?: (ctx: ReturnType<typeof useProgress>) => void }) {
  const ctx = useProgress();
  React.useEffect(() => { onReady?.(ctx); }, [ctx.progress, ctx.loading]);
  return (
    <>
      <Text testID="loading">{String(ctx.loading)}</Text>
      <Text testID="streak">{ctx.progress?.currentStreak ?? ''}</Text>
      <Text testID="day">{ctx.progress?.currentDayUnlocked ?? ''}</Text>
      <Text testID="completed">{JSON.stringify(ctx.progress?.completedDays ?? [])}</Text>
      <TouchableOpacity testID="complete1" onPress={() => ctx.completeDay(1)} />
      <TouchableOpacity testID="startDay" onPress={() => ctx.startDay()} />
      <TouchableOpacity testID="reset" onPress={() => ctx.resetProgress()} />
    </>
  );
}

function renderWithProvider(onReady?: (ctx: ReturnType<typeof useProgress>) => void) {
  return render(
    <ProgressProvider>
      <TestConsumer onReady={onReady} />
    </ProgressProvider>,
  );
}

describe('useProgress', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loads initial progress state (empty)', async () => {
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    expect(getByTestId('completed').props.children).toBe('[]');
    expect(getByTestId('day').props.children).toBe(1);
  });

  it('returns loading=true while AsyncStorage reads', () => {
    const { getByTestId } = renderWithProvider();
    expect(getByTestId('loading').props.children).toBe('true');
  });

  it('returns loading=false after data loads', async () => {
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
  });

  it('completeDay marks day as completed', async () => {
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    await act(async () => { fireEvent.press(getByTestId('complete1')); });
    await waitFor(() => {
      const completed = JSON.parse(getByTestId('completed').props.children);
      expect(completed).toContain(1);
    });
  });

  it('completeDay unlocks the next day', async () => {
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    await act(async () => { fireEvent.press(getByTestId('complete1')); });
    await waitFor(() => expect(getByTestId('day').props.children).toBe(2));
  });

  it('startDay updates lastPracticeDate', async () => {
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    await act(async () => { fireEvent.press(getByTestId('startDay')); });
    // Verify by checking AsyncStorage was called
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('resetProgress calls loadProgress and persists', async () => {
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    // complete a day first
    await act(async () => { fireEvent.press(getByTestId('complete1')); });
    // now reset — reloads from storage
    await act(async () => { fireEvent.press(getByTestId('reset')); });
    // resetProgress calls setAndPersist which calls saveProgress
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('setProgress persists to AsyncStorage', async () => {
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    await act(async () => { fireEvent.press(getByTestId('complete1')); });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('handles corrupted AsyncStorage data gracefully', async () => {
    await AsyncStorage.setItem('speakcoach_progress_v1', 'INVALID_JSON{{{');
    const { getByTestId } = renderWithProvider();
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    // Should fall back to defaults
    expect(getByTestId('completed').props.children).toBe('[]');
  });

  it('throws error when used outside ProgressProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useProgress must be used within ProgressProvider');
    spy.mockRestore();
  });
});
