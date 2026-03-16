import React from 'react';
import { render } from '@testing-library/react-native';
import { StatCard } from '../../src/components/StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    const { getByText } = render(<StatCard label="Streak" value="7 days" />);
    expect(getByText('Streak')).toBeTruthy();
    expect(getByText('7 days')).toBeTruthy();
  });

  it('renders icon when provided', () => {
    const { toJSON } = render(<StatCard label="Streak" value="7" icon="S" />);
    expect(toJSON()).toBeTruthy();
  });
});
