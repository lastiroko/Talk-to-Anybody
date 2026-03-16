import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { PlanExercise } from '../../src/types/progress';

const mockExercise: PlanExercise = {
  id: 'test_01',
  type: 'record',
  prompt: 'Describe your morning routine',
  durationSec: 60,
  targetMetrics: ['wpm'],
};

describe('ExerciseCard', () => {
  it('shows exercise prompt', () => {
    render(
      <ExerciseCard exercise={mockExercise} isCompleted={false} onStart={jest.fn()} />,
    );
    expect(screen.getByText('Describe your morning routine')).toBeTruthy();
  });

  it('shows duration', () => {
    render(
      <ExerciseCard exercise={mockExercise} isCompleted={false} onStart={jest.fn()} />,
    );
    expect(screen.getByText('60s')).toBeTruthy();
  });

  it('shows type badge', () => {
    render(
      <ExerciseCard exercise={mockExercise} isCompleted={false} onStart={jest.fn()} />,
    );
    expect(screen.getByText('Record')).toBeTruthy();
  });

  it('calls onStart when Start button pressed', () => {
    const onStart = jest.fn();
    render(
      <ExerciseCard exercise={mockExercise} isCompleted={false} onStart={onStart} />,
    );
    fireEvent.press(screen.getByText('Start'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('shows completed state with checkmark', () => {
    render(
      <ExerciseCard exercise={mockExercise} isCompleted={true} onStart={jest.fn()} />,
    );
    expect(screen.getByText('\u2713')).toBeTruthy();
  });

  it('hides start button when completed', () => {
    render(
      <ExerciseCard exercise={mockExercise} isCompleted={true} onStart={jest.fn()} />,
    );
    expect(screen.queryByText('Start')).toBeNull();
  });
});
