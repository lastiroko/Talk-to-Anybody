import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface DotChartProps {
  data: { label: string; value: number }[];
  maxValue: number;
  height: number;
}

export function DotChart({ data, maxValue, height }: DotChartProps) {
  const gridLines = [0.25, 0.5, 0.75];

  return (
    <View style={styles.container}>
      {/* Chart area */}
      <View style={[styles.chartArea, { height }]}>
        {/* Grid lines */}
        {gridLines.map((pct) => (
          <View
            key={pct}
            style={[
              styles.gridLine,
              { bottom: pct * height },
            ]}
          >
            <Text style={styles.gridLabel}>{Math.round(pct * maxValue)}</Text>
          </View>
        ))}

        {/* Dots */}
        {data.map((point, i) => {
          const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
          const y = (point.value / maxValue) * height;
          return (
            <View
              key={point.label}
              style={[
                styles.dot,
                {
                  bottom: y - 5,
                  left: `${x}%`,
                  marginLeft: -5,
                },
              ]}
            />
          );
        })}
      </View>

      {/* X-axis labels */}
      <View style={styles.xLabels}>
        {data.map((point, i) => (
          <Text
            key={point.label}
            style={[
              styles.xLabel,
              {
                position: 'absolute',
                left: `${data.length > 1 ? (i / (data.length - 1)) * 100 : 50}%`,
                transform: [{ translateX: -12 }],
              },
            ]}
          >
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
  },
  chartArea: {
    position: 'relative',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    position: 'absolute',
    left: -30,
    fontSize: 10,
    color: '#8A8A8A',
    width: 26,
    textAlign: 'right',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#141414',
  },
  xLabels: {
    position: 'relative',
    height: 20,
    marginTop: spacing.xs,
  },
  xLabel: {
    fontSize: 10,
    color: '#8A8A8A',
    width: 24,
    textAlign: 'center',
  },
});
