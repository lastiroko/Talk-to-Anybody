import { Text, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export function HomeScreen() {
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Today’s workout and quick stats will appear here.</Text>
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
