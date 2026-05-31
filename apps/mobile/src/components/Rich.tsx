/**
 * Rich/gamified screen primitives — implements the layouts from
 * `docs/toaa-review/sc-screens-rich.jsx` for HomeScreen, DiscoverScreen,
 * and LeaderboardScreen.
 */
import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─────────────────────────────────────────────────────────────────────────
// StatPill — small white pill with hairline border, icon + value.
// Used for currency display (gems, coins).
// ─────────────────────────────────────────────────────────────────────────
interface StatPillProps {
  icon: IoniconName;
  color: string;
  value: string | number;
}

export function StatPill({ icon, color, value }: StatPillProps) {
  return (
    <View style={statPillStyles.pill}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={statPillStyles.value}>{value}</Text>
    </View>
  );
}

const statPillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#1F1B16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  value: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 14,
    color: colors.text,
  },
});

// ─────────────────────────────────────────────────────────────────────────
// CurrencyRow — gem + coin display (top-right of most rich screens).
// ─────────────────────────────────────────────────────────────────────────
interface CurrencyRowProps {
  gems: number;
  coins: number;
}

export function CurrencyRow({ gems, coins }: CurrencyRowProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <StatPill icon="diamond" color={colors.lavender} value={gems.toLocaleString()} />
      <StatPill icon="ellipse" color={colors.butter} value={coins.toLocaleString()} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Waveform — coral audio waveform with played/unplayed split.
// ─────────────────────────────────────────────────────────────────────────
interface WaveformProps {
  played?: number; // 0-1
  bars?: number;
}

export function Waveform({ played = 0.45, bars = 38 }: WaveformProps) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / bars;
    return 8 + Math.abs(Math.sin(t * 9) * Math.cos(t * 3)) * 30 + (i % 3) * 3;
  });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, height: 44, flex: 1 }}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={{
            width: 3,
            height: h,
            borderRadius: 999,
            backgroundColor: i / bars < played ? colors.primary : colors.primaryLight,
          }}
        />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MinutesChart — bar chart, recent bars filled coral, older bars fade.
// ─────────────────────────────────────────────────────────────────────────
interface MinutesChartProps {
  bars?: number;
}

export function MinutesChart({ bars = 26 }: MinutesChartProps) {
  const heights = Array.from({ length: bars }, (_, i) => 14 + Math.pow(i / (bars - 1), 1.3) * 70 + (i % 4) * 5);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 96 }}>
      {heights.map((h, i) => {
        const recent = i >= bars - 4;
        const fade = recent ? 1 : 0.4 + (i / bars) * 0.5;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: h,
              borderRadius: 4,
              backgroundColor: colors.primary,
              opacity: fade,
            }}
          />
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ChallengeRow — drill/game card with colored icon-box, title, sub, chips.
// ─────────────────────────────────────────────────────────────────────────
interface ChallengeRowProps {
  icon: IoniconName;
  color: string;
  bg: string;
  title: string;
  sub: string;
  gem: number;
  coin: number;
  onPress?: () => void;
}

export function ChallengeRow({ icon, color, bg, title, sub, gem, coin, onPress }: ChallengeRowProps) {
  const content = (
    <View style={challengeRowStyles.row}>
      <View style={[challengeRowStyles.iconBox, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={challengeRowStyles.title}>{title}</Text>
        <View style={challengeRowStyles.metaRow}>
          <Text style={challengeRowStyles.sub}>{sub}</Text>
          <View style={challengeRowStyles.chip}>
            <Ionicons name="diamond" size={12} color={colors.lavender} />
            <Text style={challengeRowStyles.chipText}>+{gem}</Text>
          </View>
          <View style={challengeRowStyles.chip}>
            <Ionicons name="ellipse" size={12} color={colors.butter} />
            <Text style={challengeRowStyles.chipText}>+{coin}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
    </View>
  );

  if (onPress) {
    const TouchableOpacity = require('react-native').TouchableOpacity;
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const challengeRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#1F1B16',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 15,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  sub: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  chipText: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 12,
    color: colors.text,
  },
});

// ─────────────────────────────────────────────────────────────────────────
// CategoryTile — compact 92pt-wide tile for "Practice areas" carousel.
// ─────────────────────────────────────────────────────────────────────────
interface CategoryTileProps {
  icon: IoniconName;
  color: string;
  bg: string;
  label: string;
  onPress?: () => void;
}

export function CategoryTile({ icon, color, bg, label, onPress }: CategoryTileProps) {
  const content = (
    <View style={categoryTileStyles.tile}>
      <View style={[categoryTileStyles.iconBox, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={categoryTileStyles.label}>{label}</Text>
    </View>
  );

  if (onPress) {
    const TouchableOpacity = require('react-native').TouchableOpacity;
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const categoryTileStyles = StyleSheet.create({
  tile: {
    width: 92,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#1F1B16',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    fontSize: 12.5,
    color: colors.text,
    marginTop: 9,
  },
});

// ─────────────────────────────────────────────────────────────────────────
// SectionHeader — "Today's drills 3 | View all" style header
// ─────────────────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  count?: number;
  actionText?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, count, actionText, onAction }: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontWeight: typography.weightBold,
            fontSize: 16,
            color: colors.text,
          }}
        >
          {title}
        </Text>
        {count !== undefined && (
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontWeight: typography.weightSemi,
              fontSize: 16,
              color: colors.textMuted,
            }}
          >
            {count}
          </Text>
        )}
      </View>
      {actionText && (
        <Text
          onPress={onAction}
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontWeight: typography.weightSemi,
            fontSize: 13,
            color: colors.primary,
          }}
        >
          {actionText}
        </Text>
      )}
    </View>
  );
}
