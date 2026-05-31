const React = require('react');
const { View } = require('react-native');

function LinearGradient({ colors, style, children, ...rest }) {
  // Use the first color as a background so tests can still find the shape.
  const bg = Array.isArray(colors) ? colors[0] : undefined;
  return React.createElement(
    View,
    { ...rest, style: [{ backgroundColor: bg }, style] },
    children,
  );
}

module.exports = { LinearGradient };
