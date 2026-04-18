import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { usePurchase } from '../hooks/usePurchase';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type PaywallNavigation = NativeStackNavigationProp<MainStackParamList>;

type PlanOption = 'monthly' | 'lifetime';

const FEATURES = [
  { icon: '\u2713', label: 'Full 60-day plan' },
  { icon: '\u2713', label: 'All practice modes' },
  { icon: '\u2713', label: 'AI-powered analysis' },
  { icon: '\u2713', label: 'Unlimited recordings' },
];

export function PaywallScreen() {
  const navigation = useNavigation<PaywallNavigation>();
  const { setPaid, restore } = usePurchase();
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>('lifetime');
  const [restoring, setRestoring] = useState(false);

  const handlePurchase = () => {
    const planLabel =
      selectedPlan === 'monthly' ? 'Monthly (\u20ac5/month)' : 'Lifetime (\u20ac30 one-time)';

    Alert.alert(
      'Confirm Purchase',
      `You selected the ${planLabel} plan. This is a simulated purchase.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => {
            setPaid();
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleRestore = async () => {
    setRestoring(true);
    await restore();
    setRestoring(false);
    Alert.alert('Restore', 'No previous purchases found.');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.closeText}>{'\u2715'}</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{'\ud83c\udf99\ufe0f'}</Text>
          </View>
          <Text style={styles.heading}>Unlock Your Full Potential</Text>
          <Text style={styles.subheading}>
            Get unlimited access to every feature and become the speaker you were meant to be.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featureList}>
          {FEATURES.map((feature) => (
            <View key={feature.label} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </View>
          ))}
        </View>

        {/* Plan cards */}
        <View style={styles.planCards}>
          {/* Monthly */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.7}
          >
            <View style={styles.planCardHeader}>
              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === 'monthly' && styles.radioOuterSelected,
                ]}
              >
                {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.planCardInfo}>
                <Text style={styles.planTitle}>Monthly</Text>
                <Text style={styles.planPrice}>{'\u20ac'}5/month</Text>
              </View>
            </View>
            <View style={styles.planTag}>
              <Text style={styles.planTagText}>Most flexible</Text>
            </View>
          </TouchableOpacity>

          {/* Lifetime */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'lifetime' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('lifetime')}
            activeOpacity={0.7}
          >
            <View style={styles.planCardHeader}>
              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === 'lifetime' && styles.radioOuterSelected,
                ]}
              >
                {selectedPlan === 'lifetime' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.planCardInfo}>
                <Text style={styles.planTitle}>Lifetime</Text>
                <Text style={styles.planPrice}>{'\u20ac'}30 one-time</Text>
              </View>
            </View>
            <View style={[styles.planTag, styles.planTagBest]}>
              <Text style={[styles.planTagText, styles.planTagBestText]}>Best value</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={handlePurchase} activeOpacity={0.8}>
          <Text style={styles.ctaText}>Start Your Journey</Text>
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          <Text style={styles.restoreText}>
            {restoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>Cancel anytime. Terms & Privacy apply.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.xl,
  },

  // Close
  closeButton: {
    position: 'absolute',
    top: 16,
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    color: colors.muted,
    fontWeight: typography.weightSemi,
  },

  // Hero
  hero: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,69,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  iconEmoji: {
    fontSize: 44,
  },
  heading: {
    fontSize: typography.heading,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: 'center',
  },
  subheading: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },

  // Features
  featureList: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureIcon: {
    fontSize: 18,
    color: colors.success,
  },
  featureLabel: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    fontWeight: typography.weightSemi,
  },

  // Plan cards
  planCards: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,69,0,0.06)',
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  planCardInfo: {
    gap: 2,
  },
  planTitle: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  planPrice: {
    fontSize: typography.small,
    color: colors.muted,
  },
  planTag: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  planTagText: {
    fontSize: typography.small,
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: typography.weightSemi,
    color: colors.muted,
  },
  planTagBest: {
    backgroundColor: 'rgba(74,222,128,0.12)',
  },
  planTagBestText: {
    color: colors.success,
  },

  // CTA
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.weightBold,
  },

  // Restore
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  restoreText: {
    fontSize: typography.small,
    color: colors.primary,
    fontWeight: typography.weightSemi,
  },

  // Legal
  legalText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
});
