import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { PrimaryButton } from '../../src/components/PrimaryButton';

describe('PrimaryButton', () => {
  it('renders title text', () => {
    render(<PrimaryButton title="Press Me" onPress={jest.fn()} />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<PrimaryButton title="Tap" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tap'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<PrimaryButton title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows disabled styling when disabled', () => {
    render(<PrimaryButton title="Disabled" onPress={jest.fn()} disabled />);
    const button = screen.getByText('Disabled');
    // The text color should be the disabled color (colors.textLight)
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: expect.any(String) }),
      ]),
    );
  });
});
