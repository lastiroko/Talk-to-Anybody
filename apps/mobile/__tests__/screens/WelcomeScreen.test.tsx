import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { WelcomeScreen } from '../../src/screens/WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders without crashing', () => {
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={jest.fn()} />);
  });

  it('shows SpeakCoach title', () => {
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={jest.fn()} />);
    expect(screen.getByText('SpeakCoach')).toBeTruthy();
  });

  it('shows tagline', () => {
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={jest.fn()} />);
    expect(screen.getByText('Find your voice in 60 days')).toBeTruthy();
  });

  it('calls onSignup when Get Started pressed', () => {
    const onSignup = jest.fn();
    render(<WelcomeScreen onLogin={jest.fn()} onSignup={onSignup} />);
    fireEvent.press(screen.getByText('Get Started'));
    expect(onSignup).toHaveBeenCalledTimes(1);
  });

  it('calls onLogin when login link pressed', () => {
    const onLogin = jest.fn();
    render(<WelcomeScreen onLogin={onLogin} onSignup={jest.fn()} />);
    fireEvent.press(screen.getByText('I already have an account'));
    expect(onLogin).toHaveBeenCalledTimes(1);
  });
});
