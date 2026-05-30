import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { WelcomeScreen } from '../../src/screens/WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders without crashing', () => {
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={jest.fn()} />);
  });

  it('shows app branding eyebrow', () => {
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={jest.fn()} />);
    expect(screen.getByText('Talk to anybody')).toBeTruthy();
  });

  it('shows hero text', () => {
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={jest.fn()} />);
    expect(screen.getByText('Find your voice.')).toBeTruthy();
  });

  it('calls onSignup when Start training pressed', () => {
    const onSignup = jest.fn();
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={onSignup} />);
    fireEvent.press(screen.getByText('Start training'));
    expect(onSignup).toHaveBeenCalledTimes(1);
  });

  it('calls onLogin when login link pressed', () => {
    const onLogin = jest.fn();
    render(<WelcomeScreen onLogin={onLogin} onSignup={jest.fn()} />);
    fireEvent.press(screen.getByText(/Log in/));
    expect(onLogin).toHaveBeenCalledTimes(1);
  });
});
