import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Vote as VoteIcon } from 'lucide-react-native';
import { mockVotes } from '@/constants/mockData';
import VoteCard from '@/components/VoteCard';
import EmptyState from '@/components/EmptyState';

export default function ActiveScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'voted' | 'not-voted'>('all');

  const activeVotes = mockVotes.filter((vote) => vote.status === 'active');

  const filteredVotes = activeVotes.filter((vote) => {
    if (filter === 'voted') return vote.hasUserVoted;
    if (filter === 'not-voted') return !vote.hasUserVoted;
    return true;
  });

  const handleVotePress = (voteId: string) => {
    router.push(`/vote/${voteId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Votes</Text>
        <Text style={styles.headerSubtitle}>
          {activeVotes.length} active {activeVotes.length === 1 ? 'vote' : 'votes'}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
          count={activeVotes.length}
        />
        <FilterButton
          label="Voted"
          active={filter === 'voted'}
          onPress={() => setFilter('voted')}
          count={activeVotes.filter((v) => v.hasUserVoted).length}
        />
        <FilterButton
          label="Not Voted"
          active={filter === 'not-voted'}
          onPress={() => setFilter('not-voted')}
          count={activeVotes.filter((v) => !v.hasUserVoted).length}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {filteredVotes.length > 0 ? (
          filteredVotes.map((vote) => (
            <VoteCard
              key={vote.id}
              vote={vote}
              onPress={() => handleVotePress(vote.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={VoteIcon}
            title="No Active Votes"
            description={
              filter === 'voted'
                ? "You haven't voted on any active proposals yet"
                : filter === 'not-voted'
                  ? 'All active votes have been completed'
                  : 'There are no active votes at the moment'
            }
          />
        )}
      </ScrollView>
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
  count,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  count: number;
}) {
  return (
    <View
      style={[styles.filterButton, active && styles.filterButtonActive]}
      onTouchEnd={onPress}>
      <Text
        style={[
          styles.filterButtonText,
          active && styles.filterButtonTextActive,
        ]}>
        {label}
      </Text>
      <View
        style={[
          styles.filterBadge,
          active && styles.filterBadgeActive,
        ]}>
        <Text
          style={[
            styles.filterBadgeText,
            active && styles.filterBadgeTextActive,
          ]}>
          {count}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
});
