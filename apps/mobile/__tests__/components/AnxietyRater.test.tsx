import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AnxietyRater } from '../../src/components/AnxietyRater';

describe('AnxietyRater', () => {
  it('renders 10 rating circles', () => {
    render(<AnxietyRater label="How anxious?" value={null} onChange={jest.fn()} />);
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(String(i))).toBeTruthy();
    }
  });

  it('highlights selected rating', () => {
    render(<AnxietyRater label="How anxious?" value={5} onChange={jest.fn()} />);
    const selectedCircle = screen.getByText('5');
    // When selected, the text color is white
    expect(selectedCircle.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#fff' }),
      ]),
    );
  });

  it('calls onChange when rating tapped', () => {
    const onChange = jest.fn();
    render(<AnxietyRater label="How anxious?" value={null} onChange={onChange} />);
    fireEvent.press(screen.getByText('7'));
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('shows label text', () => {
    render(<AnxietyRater label="Rate your anxiety" value={null} onChange={jest.fn()} />);
    expect(screen.getByText('Rate your anxiety')).toBeTruthy();
  });

  it('no rating selected initially when value is null', () => {
    render(<AnxietyRater label="How anxious?" value={null} onChange={jest.fn()} />);
    // When not selected, text color should be the muted color, not '#fff'
    for (let i = 1; i <= 10; i++) {
      const circle = screen.getByText(String(i));
      const styles = circle.props.style;
      const flatStyles = Array.isArray(styles)
        ? Object.assign({}, ...styles)
        : styles;
      expect(flatStyles.color).not.toBe('#fff');
    }
  });
});
