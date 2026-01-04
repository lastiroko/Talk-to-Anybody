import { Text, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export function PlanScreen() {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Plan</Text>
        <Text style={styles.subtitle}>60-day plan grid/list placeholder.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
  },
});
