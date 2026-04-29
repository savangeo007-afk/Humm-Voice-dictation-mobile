import React, {useCallback} from 'react';
import {View, Text, Pressable, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {User, Globe, Key, CreditCard, Mic, ChevronRight} from 'lucide-react-native';
import {Theme} from '../theme';
import {useApp} from '../context/AppContext';
import MorphicCard from '../components/MorphicCard';
import MorphicSwitch from '../components/MorphicSwitch';

type MenuItem = {
  label: string;
  route: string;
  Icon: React.ElementType;
};

const MENU_ITEMS: MenuItem[] = [
  {label: 'Personal Details', route: 'PersonalDetails', Icon: User},
  {label: 'System Dictation', route: 'OverlayPermissions', Icon: Mic},
  {label: 'Sarvam Configuration', route: 'SarvamConfig', Icon: Globe},
  {label: 'BYOK Hub', route: 'BYOKHub', Icon: Key},
  {label: 'Billing & Subscriptions', route: 'Billing', Icon: CreditCard},
];

export function SettingsHubContent() {
  const navigation = useNavigation();
  const {privacyMode, setPrivacyMode} = useApp();

  const handleNavigate = useCallback(
    (route: string) => {
      navigation.navigate(route as never);
    },
    [navigation],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.menuList}>
        {MENU_ITEMS.map(item => (
          <Pressable
            key={item.route}
            onPress={() => handleNavigate(item.route)}>
            <MorphicCard style={styles.menuCard}>
              <View style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <View style={styles.iconContainer}>
                    <item.Icon size={20} color={Theme.colors.orange} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <ChevronRight size={20} color={Theme.colors.textSecondary} />
              </View>
            </MorphicCard>
          </Pressable>
        ))}
      </View>

      <View style={styles.privacySection}>
        <MorphicCard style={styles.privacyCard}>
          <View style={styles.privacyRow}>
            <View style={styles.privacyText}>
              <Text style={styles.privacyLabel}>Privacy Mode</Text>
              <Text style={styles.privacyDescription}>
                When enabled, new transcriptions stay local and are not saved to
                cloud history
              </Text>
            </View>
            <MorphicSwitch value={privacyMode} onValueChange={setPrivacyMode} />
          </View>
        </MorphicCard>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 28,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xxl,
  },
  menuList: {
    gap: Theme.spacing.md,
  },
  menuCard: {
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 16,
    color: Theme.colors.white,
  },
  privacySection: {
    marginTop: Theme.spacing.xxxl,
  },
  privacyCard: {
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyText: {
    flex: 1,
    marginRight: Theme.spacing.lg,
  },
  privacyLabel: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 16,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  privacyDescription: {
    fontFamily: Theme.typography.inter,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
});
