import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { DayTile } from '../../src/components/DayTile';

describe('DayTile', () => {
  it('renders day number', () => {
    render(<DayTile dayNumber={5} status="current" onPress={jest.fn()} />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('shows checkmark for completed status', () => {
    render(<DayTile dayNumber={1} status="completed" onPress={jest.fn()} />);
    expect(screen.getByText('\u2713')).toBeTruthy();
  });

  it('shows play icon for current status', () => {
    render(<DayTile dayNumber={2} status="current" onPress={jest.fn()} />);
    expect(screen.getByText('\u25b6')).toBeTruthy();
  });

  it('shows lock icon for locked status', () => {
    render(<DayTile dayNumber={3} status="locked" onPress={jest.fn()} />);
    expect(screen.getByText('\ud83d\udd12')).toBeTruthy();
  });

  it('calls onPress on tap', () => {
    const onPress = jest.fn();
    render(<DayTile dayNumber={4} status="current" onPress={onPress} />);
    fireEvent.press(screen.getByText('4'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
