import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import GameResultCard from '../../src/components/GameResultCard';

const defaultProps = {
  gameName: 'Word Sprint',
  score: 8,
  maxScore: 10,
  highScore: 6,
  isNewHighScore: true,
  stats: [
    { label: 'Time', value: '45s' },
    { label: 'Accuracy', value: '80%' },
  ],
  onPlayAgain: jest.fn(),
  onExit: jest.fn(),
};

describe('GameResultCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders game name area heading', () => {
    render(<GameResultCard {...defaultProps} />);
    // When isNewHighScore is true, heading says "New High Score!"
    expect(screen.getByText('New High Score!')).toBeTruthy();
  });

  it('shows score', () => {
    render(<GameResultCard {...defaultProps} />);
    // The previous best line contains the highScore value
    expect(screen.getByText('Previous best: 6')).toBeTruthy();
  });

  it('shows stats rows', () => {
    render(<GameResultCard {...defaultProps} />);
    expect(screen.getByText('Time')).toBeTruthy();
    expect(screen.getByText('45s')).toBeTruthy();
    expect(screen.getByText('Accuracy')).toBeTruthy();
    expect(screen.getByText('80%')).toBeTruthy();
  });

  it('calls onPlayAgain', () => {
    const onPlayAgain = jest.fn();
    render(<GameResultCard {...defaultProps} onPlayAgain={onPlayAgain} />);
    fireEvent.press(screen.getByText('Play Again'));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('calls onExit', () => {
    const onExit = jest.fn();
    render(<GameResultCard {...defaultProps} onExit={onExit} />);
    fireEvent.press(screen.getByText('Back to Practice'));
    expect(onExit).toHaveBeenCalledTimes(1);
  });
});
