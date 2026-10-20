import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameButton } from '@/components/GameButton';
import { useProgress } from '@/game/progress';
import type { GameSettings } from '@/storage/save';
import { palette, radius } from '@/theme/tokens';

const preferences: { key: keyof GameSettings; name: string; detail: string }[] = [
  { key: 'sound', name: 'Sound effects', detail: 'Short feedback tones during play' },
  { key: 'haptics', name: 'Haptic feedback', detail: 'Gentle vibration on supported devices' },
  { key: 'reducedMotion', name: 'Reduced motion', detail: 'Minimize sliding and movement animations' },
];

export default function SettingsScreen() {
  const { settings, setSetting, resetProgress, completedCount } = useProgress();
  const confirmReset = () => {
    Alert.alert(
      'Reset your progress?',
      'This clears unlocked levels, stars and best moves. Your preferences will stay the same.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset progress', style: 'destructive', onPress: resetProgress },
      ],
    );
  };
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Text style={styles.backArrow}>‹</Text></Pressable>
          <Text style={styles.eyebrow}>MAKE IT YOURS</Text>
          <Text style={styles.heading}>Settings</Text>
          <Text style={styles.description}>A little comfort makes the whole switchyard better.</Text>
          <View style={styles.card}>
            {preferences.map((item, index) => (
              <View key={item.key} style={[styles.settingRow, index !== preferences.length - 1 && styles.border]}>
                <View style={styles.descriptionColumn}>
                  <Text style={styles.settingTitle}>{item.name}</Text>
                  <Text style={styles.settingDetail}>{item.detail}</Text>
                </View>
                <Switch accessibilityLabel={item.name} value={settings[item.key]} onValueChange={(next) => setSetting(item.key, next)} trackColor={{ false: '#D5DAD9', true: palette.teal }} thumbColor={palette.white} />
              </View>
            ))}
          </View>
          <Text style={styles.sectionLabel}>YOUR JOURNEY</Text>
          <View style={styles.resetCard}>
            <Text style={styles.settingTitle}>Start fresh</Text>
            <Text style={styles.settingDetail}>{completedCount} completed levels. You can clear your progress without changing preferences.</Text>
            <GameButton title="Reset saved progress" kind="secondary" onPress={confirmReset} disabled={completedCount === 0} style={styles.resetButton} />
          </View>
          <Text style={styles.version}>POCKET SWITCHYARD · VERSION 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1, padding: 20 },
  container: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  back: { height: 48, width: 48, borderRadius: 17, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  backArrow: { fontSize: 34, color: palette.ink, marginTop: -5 },
  eyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 2, color: palette.teal },
  heading: { fontWeight: '900', fontSize: 36, color: palette.ink, marginTop: 8 },
  description: { fontSize: 14, lineHeight: 22, color: palette.muted, marginTop: 9, marginBottom: 25 },
  card: { backgroundColor: palette.white, borderRadius: radius.lg, paddingHorizontal: 18 },
  settingRow: { minHeight: 93, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  border: { borderBottomWidth: 1, borderBottomColor: palette.stroke },
  descriptionColumn: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '800', color: palette.ink },
  settingDetail: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  sectionLabel: { marginTop: 32, marginBottom: 11, fontSize: 10, fontWeight: '900', letterSpacing: 1.8, color: palette.muted },
  resetCard: { backgroundColor: palette.yellowPale, borderRadius: radius.lg, padding: 18 },
  resetButton: { marginTop: 16 },
  version: { textAlign: 'center', color: '#ADB2B8', fontWeight: '800', fontSize: 9, letterSpacing: 1.6, marginTop: 40 },
});
