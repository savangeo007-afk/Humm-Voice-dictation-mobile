import React, {useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Mic} from 'lucide-react-native';
import {Theme} from '../theme';
import {useApp} from '../context/AppContext';
import HummLogo from '../components/HummLogo';
import StatChip from '../components/StatChip';
import MorphicCard from '../components/MorphicCard';
import TranscriptionCard from '../components/TranscriptionCard';
import type {TranscriptionHistoryItem} from '../types';

export function HomeContent() {
  const {
    whisperStatus,
    whisperError,
    stats,
    transcriptions,
    deleteTranscriptionItem,
    retryTranscription,
  } = useApp();

  const handleCopy = useCallback((item: TranscriptionHistoryItem) => {
    Clipboard.setString(item.text);
  }, []);

  const handleRetry = useCallback(
    (item: TranscriptionHistoryItem) => {
      retryTranscription(item);
    },
    [retryTranscription],
  );

  const handleDelete = useCallback(
    (item: TranscriptionHistoryItem) => {
      deleteTranscriptionItem(item.id);
    },
    [deleteTranscriptionItem],
  );

  const renderStatusIndicator = () => {
    switch (whisperStatus) {
      case 'loading':
        return (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={Theme.colors.orange} />
            <Text style={styles.statusText}>Loading model...</Text>
          </View>
        );
      case 'ready':
        return (
          <View style={styles.statusRow}>
            <View
              style={[styles.statusDot, {backgroundColor: Theme.colors.green}]}
            />
            <Text style={styles.statusText}>Ready</Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.statusRow}>
            <View
              style={[styles.statusDot, {backgroundColor: Theme.colors.orange}]}
            />
            <Text style={styles.statusText}>{whisperError || 'Error'}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const languageLabel =
    stats.languagesSpoken.length > 0 ? stats.languagesSpoken.join(', ') : '--';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <HummLogo width={200} height={80} showText />

      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <StatChip
              label="Total Words"
              value={stats.totalWords}
              color={Theme.colors.orange}
            />
          </View>
          <View style={styles.statCell}>
            <StatChip
              label="Apps"
              value={stats.appsUsed}
              color={Theme.colors.white}
            />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <StatChip
              label="WPM"
              value={stats.wpm}
              color={Theme.colors.green}
            />
          </View>
          <View style={styles.statCell}>
            <StatChip
              label="Languages"
              value={languageLabel}
              color={Theme.colors.textSecondary}
            />
          </View>
        </View>
      </View>

      {renderStatusIndicator()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transcriptions</Text>

        {transcriptions.length === 0 ? (
          <MorphicCard style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <View style={styles.emptyIconContainer}>
                <Mic size={32} color={Theme.colors.textSecondary} />
              </View>
              <Text style={styles.emptyText}>
                Your transcriptions will appear here
              </Text>
            </View>
          </MorphicCard>
        ) : (
          transcriptions.map(item => (
            <TranscriptionCard
              key={item.id}
              item={item}
              onCopy={handleCopy}
              onRetry={handleRetry}
              onDelete={handleDelete}
            />
          ))
        )}
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
  statsGrid: {
    marginTop: Theme.spacing.xl,
    gap: Theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  statCell: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: Theme.typography.inter,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  section: {
    marginTop: Theme.spacing.xxl,
  },
  sectionTitle: {
    fontFamily: Theme.typography.anton,
    fontSize: 24,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.lg,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxxl,
  },
  emptyContent: {
    alignItems: 'center',
    gap: Theme.spacing.lg,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});
