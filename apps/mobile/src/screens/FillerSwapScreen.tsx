import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GameResultCard from '../components/GameResultCard';
import { saveGameScore, getHighScore } from '../storage/gameScores';
import { ScreenContainer } from '../components/ScreenContainer';
import { PrimaryButton } from '../components/PrimaryButton';

// ---------------------------------------------------------------------------
// Theme tokens (inlined so we don't depend on external theme files at runtime)
// ---------------------------------------------------------------------------
const colors = {
  background: '#0A0A0A',
  surface: '#141414',
  primary: '#FF4500',
  primaryDark: '#E63946',
  text: '#FFFFFF',
  muted: '#8A8A8A',
  border: 'rgba(255,255,255,0.08)',
};

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

const typography = {
  heading: 24,
  subheading: 18,
  body: 16,
  small: 14,
  weightBold: '700' as const,
  weightSemi: '600' as const,
  weightRegular: '400' as const,
  fontRegular: 'JetBrainsMono_400Regular',
  fontSemi: 'JetBrainsMono_600SemiBold',
  fontBold: 'JetBrainsMono_700Bold',
  fontDisplay: 'SpaceGrotesk_700Bold',
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
interface FillerSentence {
  id: string;
  text: string;
  fillers: {
    word: string;
    startIndex: number;
    endIndex: number;
    replacements: string[]; // 3 options; "[Remove]" means delete the filler
  }[];
}

const SENTENCES: FillerSentence[] = [
  {
    id: '1',
    text: "So, um, I think the main point here is, like, we need to, you know, focus on the customer.",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["First,", "To begin,", "[Remove]"] },
      { word: "um,", startIndex: 4, endIndex: 7, replacements: ["[Remove]", "specifically,", "clearly,"] },
      { word: "like,", startIndex: 40, endIndex: 45, replacements: ["[Remove]", "essentially,", "that"] },
      { word: "you know,", startIndex: 58, endIndex: 67, replacements: ["[Remove]", "certainly,", "undeniably,"] },
    ],
  },
  {
    id: '2',
    text: "I mean, the project is basically done, we just need to, like, finalize the report.",
    fillers: [
      { word: "I mean,", startIndex: 0, endIndex: 7, replacements: ["[Remove]", "In truth,", "Frankly,"] },
      { word: "basically", startIndex: 23, endIndex: 32, replacements: ["nearly", "almost", "[Remove]"] },
      { word: "just", startIndex: 44, endIndex: 48, replacements: ["[Remove]", "only", "simply"] },
      { word: "like,", startIndex: 58, endIndex: 63, replacements: ["[Remove]", "indeed,", "officially,"] },
    ],
  },
  {
    id: '3',
    text: "So the results are, um, actually quite impressive, you know?",
    fillers: [
      { word: "So", startIndex: 0, endIndex: 2, replacements: ["[Remove]", "Well,", "Now,"] },
      { word: "um,", startIndex: 19, endIndex: 22, replacements: ["[Remove]", "in fact,", "truly,"] },
      { word: "actually", startIndex: 23, endIndex: 31, replacements: ["[Remove]", "genuinely", "remarkably"] },
      { word: "you know?", startIndex: 51, endIndex: 60, replacements: ["[Remove]", "right?", "indeed."] },
    ],
  },
  {
    id: '4',
    text: "Uh, I literally spent all weekend working on this, and stuff.",
    fillers: [
      { word: "Uh,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Yes,", "Well,"] },
      { word: "literally", startIndex: 6, endIndex: 15, replacements: ["[Remove]", "truly", "genuinely"] },
      { word: "and stuff.", startIndex: 51, endIndex: 61, replacements: ["and more.", "among other tasks.", "[Remove]"] },
    ],
  },
  {
    id: '5',
    text: "Like, I kind of think we should, you know, change our approach, right?",
    fillers: [
      { word: "Like,", startIndex: 0, endIndex: 5, replacements: ["[Remove]", "Honestly,", "Truly,"] },
      { word: "kind of", startIndex: 8, endIndex: 15, replacements: ["[Remove]", "strongly", "firmly"] },
      { word: "you know,", startIndex: 32, endIndex: 41, replacements: ["[Remove]", "decisively,", "certainly,"] },
      { word: "right?", startIndex: 64, endIndex: 70, replacements: ["[Remove]", "don't you agree?", "correct?"] },
    ],
  },
  {
    id: '6',
    text: "So, basically, our strategy is, like, sort of working but not, um, perfectly.",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Currently,", "Overall,"] },
      { word: "basically,", startIndex: 4, endIndex: 14, replacements: ["[Remove]", "in short,", "to summarize,"] },
      { word: "like,", startIndex: 31, endIndex: 36, replacements: ["[Remove]", "admittedly,", "arguably,"] },
      { word: "sort of", startIndex: 37, endIndex: 44, replacements: ["partially", "somewhat", "[Remove]"] },
      { word: "um,", startIndex: 62, endIndex: 65, replacements: ["[Remove]", "yet,", "quite,"] },
    ],
  },
  {
    id: '7',
    text: "I mean, it's just a really small issue, and everything.",
    fillers: [
      { word: "I mean,", startIndex: 0, endIndex: 7, replacements: ["[Remove]", "Honestly,", "Truly,"] },
      { word: "just", startIndex: 13, endIndex: 17, replacements: ["[Remove]", "only", "merely"] },
      { word: "and everything.", startIndex: 40, endIndex: 55, replacements: ["overall.", "in general.", "[Remove]"] },
    ],
  },
  {
    id: '8',
    text: "Um, I actually wanted to, like, discuss the new, uh, budget proposal.",
    fillers: [
      { word: "Um,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Today,", "Next,"] },
      { word: "actually", startIndex: 6, endIndex: 14, replacements: ["[Remove]", "specifically", "particularly"] },
      { word: "like,", startIndex: 27, endIndex: 32, replacements: ["[Remove]", "formally,", "officially,"] },
      { word: "uh,", startIndex: 50, endIndex: 53, replacements: ["[Remove]", "revised", "updated"] },
    ],
  },
  {
    id: '9',
    text: "You know, the team basically needs to just communicate better, right?",
    fillers: [
      { word: "You know,", startIndex: 0, endIndex: 9, replacements: ["[Remove]", "Clearly,", "Evidently,"] },
      { word: "basically", startIndex: 20, endIndex: 29, replacements: ["[Remove]", "fundamentally", "urgently"] },
      { word: "just", startIndex: 39, endIndex: 43, replacements: ["[Remove]", "actively", "deliberately"] },
      { word: "right?", startIndex: 63, endIndex: 69, replacements: ["[Remove]", "don't you think?", "agreed?"] },
    ],
  },
  {
    id: '10',
    text: "So, like, the client literally said they want, um, faster delivery.",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Notably,", "Importantly,"] },
      { word: "like,", startIndex: 4, endIndex: 9, replacements: ["[Remove]", "specifically,", "clearly,"] },
      { word: "literally", startIndex: 21, endIndex: 30, replacements: ["[Remove]", "explicitly", "directly"] },
      { word: "um,", startIndex: 47, endIndex: 50, replacements: ["[Remove]", "significantly", "noticeably"] },
    ],
  },
  {
    id: '11',
    text: "I just feel like maybe we should sort of reconsider our options, you know?",
    fillers: [
      { word: "just", startIndex: 2, endIndex: 6, replacements: ["[Remove]", "truly", "sincerely"] },
      { word: "like", startIndex: 12, endIndex: 16, replacements: ["[Remove]", "that", "as though"] },
      { word: "sort of", startIndex: 34, endIndex: 41, replacements: ["[Remove]", "thoroughly", "carefully"] },
      { word: "you know?", startIndex: 65, endIndex: 74, replacements: ["[Remove]", "agreed?", "right?"] },
    ],
  },
  {
    id: '12',
    text: "Basically, um, I think the data kind of supports our hypothesis.",
    fillers: [
      { word: "Basically,", startIndex: 0, endIndex: 10, replacements: ["[Remove]", "In summary,", "Overall,"] },
      { word: "um,", startIndex: 11, endIndex: 14, replacements: ["[Remove]", "clearly,", "indeed,"] },
      { word: "kind of", startIndex: 31, endIndex: 38, replacements: ["strongly", "clearly", "[Remove]"] },
    ],
  },
  {
    id: '13',
    text: "So, I actually believe, like, this solution will work, and stuff.",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Confidently,", "Firmly,"] },
      { word: "actually", startIndex: 6, endIndex: 14, replacements: ["[Remove]", "genuinely", "sincerely"] },
      { word: "like,", startIndex: 24, endIndex: 29, replacements: ["[Remove]", "that", "confidently,"] },
      { word: "and stuff.", startIndex: 54, endIndex: 64, replacements: ["and beyond.", "effectively.", "[Remove]"] },
    ],
  },
  {
    id: '14',
    text: "Uh, the presentation was, you know, kind of long but, like, informative.",
    fillers: [
      { word: "Uh,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Yes,", "Admittedly,"] },
      { word: "you know,", startIndex: 26, endIndex: 35, replacements: ["[Remove]", "admittedly,", "certainly,"] },
      { word: "kind of", startIndex: 36, endIndex: 43, replacements: ["somewhat", "fairly", "[Remove]"] },
      { word: "like,", startIndex: 54, endIndex: 59, replacements: ["[Remove]", "very", "quite"] },
    ],
  },
  {
    id: '15',
    text: "I mean, we literally have no choice but to, um, adapt, right?",
    fillers: [
      { word: "I mean,", startIndex: 0, endIndex: 7, replacements: ["[Remove]", "Plainly,", "Clearly,"] },
      { word: "literally", startIndex: 11, endIndex: 20, replacements: ["[Remove]", "truly", "absolutely"] },
      { word: "um,", startIndex: 44, endIndex: 47, replacements: ["[Remove]", "quickly,", "swiftly,"] },
      { word: "right?", startIndex: 55, endIndex: 61, replacements: ["[Remove]", "correct?", "agreed?"] },
    ],
  },
  {
    id: '16',
    text: "So, um, the marketing team just needs to basically rethink their strategy.",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Clearly,", "Now,"] },
      { word: "um,", startIndex: 4, endIndex: 7, replacements: ["[Remove]", "evidently,", "plainly,"] },
      { word: "just", startIndex: 28, endIndex: 32, replacements: ["[Remove]", "urgently", "critically"] },
      { word: "basically", startIndex: 42, endIndex: 51, replacements: ["[Remove]", "completely", "fundamentally"] },
    ],
  },
  {
    id: '17',
    text: "Like, the schedule is, uh, actually quite tight, and everything.",
    fillers: [
      { word: "Like,", startIndex: 0, endIndex: 5, replacements: ["[Remove]", "Admittedly,", "Truthfully,"] },
      { word: "uh,", startIndex: 22, endIndex: 25, replacements: ["[Remove]", "indeed,", "notably,"] },
      { word: "actually", startIndex: 26, endIndex: 34, replacements: ["[Remove]", "remarkably", "extremely"] },
      { word: "and everything.", startIndex: 49, endIndex: 63, replacements: ["in every way.", "across the board.", "[Remove]"] },
    ],
  },
  {
    id: '18',
    text: "You know, I sort of expected better results, um, from the campaign.",
    fillers: [
      { word: "You know,", startIndex: 0, endIndex: 9, replacements: ["[Remove]", "Honestly,", "Frankly,"] },
      { word: "sort of", startIndex: 12, endIndex: 19, replacements: ["[Remove]", "genuinely", "certainly"] },
      { word: "um,", startIndex: 45, endIndex: 48, replacements: ["[Remove]", "particularly", "especially"] },
    ],
  },
  {
    id: '19',
    text: "So, basically, I just wanted to, like, clarify one thing, you know?",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Now,", "Next,"] },
      { word: "basically,", startIndex: 4, endIndex: 14, replacements: ["[Remove]", "briefly,", "quickly,"] },
      { word: "just", startIndex: 17, endIndex: 21, replacements: ["[Remove]", "specifically", "precisely"] },
      { word: "like,", startIndex: 33, endIndex: 38, replacements: ["[Remove]", "formally,", "clearly,"] },
      { word: "you know?", startIndex: 57, endIndex: 66, replacements: ["[Remove]", "if I may.", "please."] },
    ],
  },
  {
    id: '20',
    text: "Um, the product literally exceeded all expectations, and stuff.",
    fillers: [
      { word: "Um,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Impressively,", "Remarkably,"] },
      { word: "literally", startIndex: 16, endIndex: 25, replacements: ["[Remove]", "truly", "genuinely"] },
      { word: "and stuff.", startIndex: 52, endIndex: 62, replacements: ["and then some.", "across the board.", "[Remove]"] },
    ],
  },
  {
    id: '21',
    text: "I mean, like, the design is kind of elegant but, uh, needs polish.",
    fillers: [
      { word: "I mean,", startIndex: 0, endIndex: 7, replacements: ["[Remove]", "Truthfully,", "Notably,"] },
      { word: "like,", startIndex: 8, endIndex: 13, replacements: ["[Remove]", "overall,", "visually,"] },
      { word: "kind of", startIndex: 28, endIndex: 35, replacements: ["quite", "remarkably", "[Remove]"] },
      { word: "uh,", startIndex: 49, endIndex: 52, replacements: ["[Remove]", "still", "clearly"] },
    ],
  },
  {
    id: '22',
    text: "So, you know, the deadline is basically tomorrow, right?",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Well,", "Listen,"] },
      { word: "you know,", startIndex: 4, endIndex: 13, replacements: ["[Remove]", "importantly,", "urgently,"] },
      { word: "basically", startIndex: 30, endIndex: 39, replacements: ["[Remove]", "effectively", "literally"] },
      { word: "right?", startIndex: 50, endIndex: 56, replacements: ["[Remove]", "correct?", "understood?"] },
    ],
  },
  {
    id: '23',
    text: "Like, I literally cannot, um, understand why, you know, they rejected it.",
    fillers: [
      { word: "Like,", startIndex: 0, endIndex: 5, replacements: ["[Remove]", "Honestly,", "Truthfully,"] },
      { word: "literally", startIndex: 8, endIndex: 17, replacements: ["[Remove]", "truly", "simply"] },
      { word: "um,", startIndex: 25, endIndex: 28, replacements: ["[Remove]", "fully", "clearly"] },
      { word: "you know,", startIndex: 45, endIndex: 54, replacements: ["[Remove]", "logically,", "reasonably,"] },
    ],
  },
  {
    id: '24',
    text: "Uh, just to confirm, the meeting is, like, at three, and everything.",
    fillers: [
      { word: "Uh,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Yes,", "So,"] },
      { word: "just", startIndex: 4, endIndex: 8, replacements: ["[Remove]", "briefly", "quickly"] },
      { word: "like,", startIndex: 37, endIndex: 42, replacements: ["[Remove]", "scheduled", "confirmed"] },
      { word: "and everything.", startIndex: 53, endIndex: 68, replacements: ["as planned.", "as expected.", "[Remove]"] },
    ],
  },
  {
    id: '25',
    text: "So, I actually think, um, we kind of nailed the presentation.",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Proudly,", "Happily,"] },
      { word: "actually", startIndex: 6, endIndex: 14, replacements: ["[Remove]", "genuinely", "truly"] },
      { word: "um,", startIndex: 22, endIndex: 25, replacements: ["[Remove]", "confidently,", "certainly,"] },
      { word: "kind of", startIndex: 29, endIndex: 36, replacements: ["absolutely", "completely", "[Remove]"] },
    ],
  },
  {
    id: '26',
    text: "I mean, basically, the numbers sort of speak for themselves, you know?",
    fillers: [
      { word: "I mean,", startIndex: 0, endIndex: 7, replacements: ["[Remove]", "Clearly,", "Evidently,"] },
      { word: "basically,", startIndex: 8, endIndex: 18, replacements: ["[Remove]", "plainly,", "simply,"] },
      { word: "sort of", startIndex: 31, endIndex: 38, replacements: ["[Remove]", "clearly", "unmistakably"] },
      { word: "you know?", startIndex: 60, endIndex: 69, replacements: ["[Remove]", "don't they?", "obviously."] },
    ],
  },
  {
    id: '27',
    text: "Um, like, the feedback was actually super helpful, and stuff.",
    fillers: [
      { word: "Um,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Gratefully,", "Thankfully,"] },
      { word: "like,", startIndex: 4, endIndex: 9, replacements: ["[Remove]", "truly,", "indeed,"] },
      { word: "actually", startIndex: 27, endIndex: 35, replacements: ["[Remove]", "incredibly", "genuinely"] },
      { word: "and stuff.", startIndex: 51, endIndex: 61, replacements: ["and more.", "overall.", "[Remove]"] },
    ],
  },
  {
    id: '28',
    text: "So, uh, the new feature is, you know, kind of revolutionary, right?",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Excitingly,", "Remarkably,"] },
      { word: "uh,", startIndex: 4, endIndex: 7, replacements: ["[Remove]", "indeed,", "truly,"] },
      { word: "you know,", startIndex: 27, endIndex: 36, replacements: ["[Remove]", "arguably,", "undeniably,"] },
      { word: "kind of", startIndex: 37, endIndex: 44, replacements: ["truly", "absolutely", "[Remove]"] },
      { word: "right?", startIndex: 61, endIndex: 67, replacements: ["[Remove]", "wouldn't you say?", "correct?"] },
    ],
  },
  {
    id: '29',
    text: "Like, I just wanted to say, um, great job on the launch, and everything.",
    fillers: [
      { word: "Like,", startIndex: 0, endIndex: 5, replacements: ["[Remove]", "Sincerely,", "Genuinely,"] },
      { word: "just", startIndex: 8, endIndex: 12, replacements: ["[Remove]", "truly", "sincerely"] },
      { word: "um,", startIndex: 28, endIndex: 31, replacements: ["[Remove]", "truly,", "honestly,"] },
      { word: "and everything.", startIndex: 57, endIndex: 72, replacements: ["across the board.", "on every front.", "[Remove]"] },
    ],
  },
  {
    id: '30',
    text: "I mean, the whole process is, like, basically automated now, you know?",
    fillers: [
      { word: "I mean,", startIndex: 0, endIndex: 7, replacements: ["[Remove]", "Impressively,", "Notably,"] },
      { word: "like,", startIndex: 29, endIndex: 34, replacements: ["[Remove]", "now", "effectively"] },
      { word: "basically", startIndex: 35, endIndex: 44, replacements: ["fully", "entirely", "[Remove]"] },
      { word: "you know?", startIndex: 60, endIndex: 69, replacements: ["[Remove]", "at last.", "finally."] },
    ],
  },
  {
    id: '31',
    text: "So, um, we should, like, probably revisit this, uh, next quarter.",
    fillers: [
      { word: "So,", startIndex: 0, endIndex: 3, replacements: ["[Remove]", "Ideally,", "Strategically,"] },
      { word: "um,", startIndex: 4, endIndex: 7, replacements: ["[Remove]", "clearly,", "wisely,"] },
      { word: "like,", startIndex: 19, endIndex: 24, replacements: ["[Remove]", "definitely,", "certainly,"] },
      { word: "uh,", startIndex: 49, endIndex: 52, replacements: ["[Remove]", "early", "sometime"] },
    ],
  },
  {
    id: '32',
    text: "Basically, it's just a matter of, you know, getting everyone on the same page.",
    fillers: [
      { word: "Basically,", startIndex: 0, endIndex: 10, replacements: ["[Remove]", "Ultimately,", "Simply put,"] },
      { word: "just", startIndex: 16, endIndex: 20, replacements: ["[Remove]", "merely", "simply"] },
      { word: "you know,", startIndex: 33, endIndex: 42, replacements: ["[Remove]", "effectively,", "proactively,"] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type GameState = 'start' | 'playing' | 'result';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------------------------------------------------------------------------
// Floating "+N" animation component
// ---------------------------------------------------------------------------
function FloatingPoints({ points, onDone }: { points: number; onDone: () => void }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -48, duration: 900, useNativeDriver: true }),
    ]).start(() => onDone());
  }, []);

  return (
    <Animated.Text
      style={[
        styles.floatingPoints,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      +{points}
    </Animated.Text>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
export function FillerSwapScreen() {
  const navigation = useNavigation();

  // Global state
  const [gameState, setGameState] = useState<GameState>('start');
  const [highScore, setHighScore] = useState(0);

  // Playing state
  const [shuffledSentences, setShuffledSentences] = useState<FillerSentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replacedFillers, setReplacedFillers] = useState<Set<string>>(new Set()); // "sentenceId-fillerIdx"
  const [sentenceTexts, setSentenceTexts] = useState<Record<string, string>>({}); // live text per sentence
  const [activeFiller, setActiveFiller] = useState<number | null>(null); // index within current sentence
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sentencesCleared, setSentencesCleared] = useState(0);
  const [fillersFixed, setFillersFixed] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const [floatingPts, setFloatingPts] = useState<{ key: number; pts: number } | null>(null);
  const [cleanBanner, setCleanBanner] = useState(false);
  const [sentenceStartTime, setSentenceStartTime] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const floatingKey = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load high score on mount
  useEffect(() => {
    getHighScore('filler_swap').then(setHighScore);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // End game when timer reaches 0
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameState]);

  // Skip button timer (show after 5s on same sentence)
  useEffect(() => {
    if (gameState !== 'playing') return;
    setShowSkip(false);
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    skipTimerRef.current = setTimeout(() => setShowSkip(true), 5000);
    setSentenceStartTime(Date.now());
    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    };
  }, [currentIndex, gameState]);

  const endGame = useCallback(async () => {
    setGameState('result');
    if (timerRef.current) clearInterval(timerRef.current);
    // score is captured via the state at render time
  }, []);

  // Save score when result screen shows
  useEffect(() => {
    if (gameState === 'result') {
      saveGameScore('filler_swap', score, { fillersFixed, sentencesCleared });
      getHighScore('filler_swap').then(setHighScore);
    }
  }, [gameState]);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(SENTENCES);
    setShuffledSentences(shuffled);
    const texts: Record<string, string> = {};
    shuffled.forEach((s) => { texts[s.id] = s.text; });
    setSentenceTexts(texts);
    setCurrentIndex(0);
    setReplacedFillers(new Set());
    setActiveFiller(null);
    setScore(0);
    setTimeLeft(60);
    setSentencesCleared(0);
    setFillersFixed(0);
    setMaxPossibleScore(0);
    setFlashIdx(null);
    setFloatingPts(null);
    setCleanBanner(false);
    setShowSkip(false);
    setGameState('playing');
  }, []);

  const currentSentence = shuffledSentences[currentIndex] as FillerSentence | undefined;

  const advanceToNext = useCallback(() => {
    setActiveFiller(null);
    setFlashIdx(null);
    setCleanBanner(false);
    if (currentIndex + 1 < shuffledSentences.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Ran out of sentences — end the game
      endGame();
    }
  }, [currentIndex, shuffledSentences.length, endGame]);

  const handleFillerTap = useCallback((fillerIdx: number) => {
    if (!currentSentence) return;
    const key = `${currentSentence.id}-${fillerIdx}`;
    if (replacedFillers.has(key)) return; // already done
    setActiveFiller(fillerIdx);
  }, [currentSentence, replacedFillers]);

  const handleReplacementPick = useCallback((replacement: string) => {
    if (!currentSentence || activeFiller === null) return;
    const filler = currentSentence.fillers[activeFiller];
    const key = `${currentSentence.id}-${activeFiller}`;

    // Update replaced set
    const newReplaced = new Set(replacedFillers);
    newReplaced.add(key);
    setReplacedFillers(newReplaced);

    // Update the live text
    const currentText = sentenceTexts[currentSentence.id] ?? currentSentence.text;
    // Find the filler word in the current text
    const idx = currentText.indexOf(filler.word);
    if (idx !== -1) {
      const isRemove = replacement === '[Remove]';
      let newText: string;
      if (isRemove) {
        // Remove the filler and any trailing space
        let end = idx + filler.word.length;
        if (currentText[end] === ' ') end++;
        newText = currentText.slice(0, idx) + currentText.slice(end);
        // Trim leading space if removal was at start
        newText = newText.replace(/^\s+/, '');
        // Capitalize first char if at sentence start
        if (idx === 0 && newText.length > 0) {
          newText = newText.charAt(0).toUpperCase() + newText.slice(1);
        }
      } else {
        newText = currentText.slice(0, idx) + replacement + currentText.slice(idx + filler.word.length);
      }
      setSentenceTexts((prev) => ({ ...prev, [currentSentence.id]: newText }));
    }

    // Score
    setScore((s) => s + 10);
    setMaxPossibleScore((m) => m + 10);
    setFillersFixed((f) => f + 1);

    // Flash
    setFlashIdx(activeFiller);
    setTimeout(() => setFlashIdx(null), 400);

    // Floating points
    floatingKey.current += 1;
    setFloatingPts({ key: floatingKey.current, pts: 10 });

    setActiveFiller(null);

    // Check if all fillers in sentence cleared
    const allCleared = currentSentence.fillers.every((_, i) =>
      newReplaced.has(`${currentSentence.id}-${i}`)
    );
    if (allCleared) {
      setScore((s) => s + 5);
      setMaxPossibleScore((m) => m + 5);
      setSentencesCleared((c) => c + 1);
      setCleanBanner(true);
      // Show bonus floating points
      setTimeout(() => {
        floatingKey.current += 1;
        setFloatingPts({ key: floatingKey.current, pts: 5 });
      }, 300);
      // Auto-advance after short delay
      setTimeout(() => advanceToNext(), 1200);
    }
  }, [currentSentence, activeFiller, replacedFillers, sentenceTexts, advanceToNext]);

  // ---------------------------------------------------------------------------
  // Render sentence with tappable fillers
  // ---------------------------------------------------------------------------
  const renderSentence = useCallback(() => {
    if (!currentSentence) return null;
    const liveText = sentenceTexts[currentSentence.id] ?? currentSentence.text;

    // Build segments: find which fillers still exist in the live text
    type Segment = { text: string; fillerIdx: number | null };
    const segments: Segment[] = [];

    // Collect positions of remaining fillers in the LIVE text
    const fillerPositions: { start: number; end: number; idx: number }[] = [];
    for (let i = 0; i < currentSentence.fillers.length; i++) {
      const key = `${currentSentence.id}-${i}`;
      if (replacedFillers.has(key)) continue; // already replaced
      const filler = currentSentence.fillers[i];
      const pos = liveText.indexOf(filler.word);
      if (pos !== -1) {
        fillerPositions.push({ start: pos, end: pos + filler.word.length, idx: i });
      }
    }
    fillerPositions.sort((a, b) => a.start - b.start);

    let cursor = 0;
    for (const fp of fillerPositions) {
      if (fp.start > cursor) {
        segments.push({ text: liveText.slice(cursor, fp.start), fillerIdx: null });
      }
      segments.push({ text: liveText.slice(fp.start, fp.end), fillerIdx: fp.idx });
      cursor = fp.end;
    }
    if (cursor < liveText.length) {
      segments.push({ text: liveText.slice(cursor), fillerIdx: null });
    }

    return (
      <Text style={styles.sentenceText}>
        {segments.map((seg, i) => {
          if (seg.fillerIdx !== null) {
            const isActive = activeFiller === seg.fillerIdx;
            const isFlashing = flashIdx === seg.fillerIdx;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => handleFillerTap(seg.fillerIdx!)}
              >
                <Text
                  style={[
                    styles.fillerWord,
                    isActive && styles.fillerWordActive,
                    isFlashing && styles.fillerWordFlash,
                  ]}
                >
                  {seg.text}
                </Text>
              </TouchableOpacity>
            );
          }
          return <Text key={i}>{seg.text}</Text>;
        })}
      </Text>
    );
  }, [currentSentence, sentenceTexts, replacedFillers, activeFiller, flashIdx, handleFillerTap]);

  // ---------------------------------------------------------------------------
  // START SCREEN
  // ---------------------------------------------------------------------------
  if (gameState === 'start') {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{'\ud83d\udd04'}</Text>
          </View>
          <Text style={styles.title}>Filler Swap</Text>
          <Text style={styles.description}>
            Tap the highlighted fillers and pick a better word. How many can you fix in 60 seconds?
          </Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>High Score</Text>
            <Text style={styles.scoreValue}>{highScore > 0 ? highScore : '--'}</Text>
          </View>

          <PrimaryButton title="Start Game" onPress={startGame} />
        </View>
      </ScreenContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // RESULT SCREEN
  // ---------------------------------------------------------------------------
  if (gameState === 'result') {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <GameResultCard
            gameName="Filler Swap"
            score={score}
            maxScore={maxPossibleScore > 0 ? maxPossibleScore : 1}
            highScore={highScore}
            isNewHighScore={score > highScore}
            stats={[
              { label: 'Fillers fixed', value: String(fillersFixed) },
              { label: 'Sentences cleared', value: String(sentencesCleared) },
              { label: 'Time', value: '60s' },
            ]}
            onPlayAgain={startGame}
            onExit={() => navigation.goBack()}
          />
        </View>
      </ScreenContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // PLAYING SCREEN
  // ---------------------------------------------------------------------------
  const fillerOptions =
    activeFiller !== null && currentSentence
      ? currentSentence.fillers[activeFiller].replacements
      : [];

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.playContainer}>
        {/* Header row: Timer + Score */}
        <View style={styles.headerRow}>
          <Text style={[styles.timer, timeLeft < 10 && styles.timerDanger]}>
            {timeLeft}s
          </Text>
          <Text style={styles.scoreDisplay}>Score: {score}</Text>
        </View>

        {/* Progress */}
        <Text style={styles.progressText}>
          Sentence {currentIndex + 1} / {shuffledSentences.length}
        </Text>

        {/* Sentence card */}
        <View style={styles.sentenceCard}>
          {renderSentence()}

          {/* Clean banner */}
          {cleanBanner && (
            <Text style={styles.cleanBanner}>{'\u2728'} Clean! +5 bonus</Text>
          )}

          {/* Floating points */}
          {floatingPts && (
            <FloatingPoints
              key={floatingPts.key}
              points={floatingPts.pts}
              onDone={() => setFloatingPts(null)}
            />
          )}
        </View>

        {/* Replacement options */}
        {activeFiller !== null && (
          <View style={styles.optionsRow}>
            {fillerOptions.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.optionButton}
                activeOpacity={0.7}
                onPress={() => handleReplacementPick(opt)}
              >
                <Text style={styles.optionText}>
                  {opt === '[Remove]' ? '\ud83d\uddd1 Remove' : opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Skip button */}
        {showSkip && !cleanBanner && (
          <TouchableOpacity style={styles.skipButton} onPress={advanceToNext}>
            <Text style={styles.skipButtonText}>Skip {'\u2192'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,122,26,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,122,26,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    fontFamily: typography.fontDisplay,
    color: colors.text,
  },
  description: {
    fontSize: typography.body,
    fontFamily: typography.fontRegular,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  scoreCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreLabel: {
    fontSize: typography.body,
    color: colors.muted,
  },
  scoreValue: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },

  // Playing
  playContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timer: {
    fontSize: 32,
    fontWeight: typography.weightBold,
    fontFamily: typography.fontBold,
    color: colors.text,
  },
  timerDanger: {
    color: '#E63946',
  },
  scoreDisplay: {
    fontSize: typography.subheading,
    fontWeight: typography.weightSemi,
    fontFamily: typography.fontSemi,
    color: colors.primary,
  },
  progressText: {
    fontSize: typography.small,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  sentenceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    justifyContent: 'center',
    position: 'relative',
  },
  sentenceText: {
    fontSize: typography.body,
    fontFamily: typography.fontRegular,
    lineHeight: 28,
    color: colors.text,
    flexWrap: 'wrap',
  },
  fillerWord: {
    backgroundColor: 'rgba(255,122,26,0.12)',
    borderWidth: 1,
    borderColor: '#FF7A1A',
    borderRadius: 4,
    fontWeight: typography.weightBold,
    color: colors.text,
    paddingHorizontal: 2,
    overflow: 'hidden',
  },
  fillerWordActive: {
    backgroundColor: 'rgba(255,122,26,0.2)',
    borderColor: '#FF4500',
  },
  fillerWordFlash: {
    backgroundColor: 'rgba(74,222,128,0.2)',
    borderColor: '#4ADE80',
  },
  cleanBanner: {
    textAlign: 'center',
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: '#4ADE80',
    marginTop: spacing.md,
  },
  floatingPoints: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.sm,
    fontSize: 22,
    fontWeight: typography.weightBold,
    color: '#4ADE80',
  },

  // Options
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 90,
    alignItems: 'center',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: typography.small,
    fontWeight: typography.weightSemi,
  },

  // Skip
  skipButton: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  skipButtonText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.muted,
  },
});
