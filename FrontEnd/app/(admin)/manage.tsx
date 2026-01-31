import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText } from 'lucide-react-native';
import { mockVotes } from '@/constants/mockData';
import ProposalCard from '@/components/ProposalCard';
import EmptyState from '@/components/EmptyState';

export default function ManageProposalsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');

  const filteredVotes = mockVotes.filter((vote) => {
    if (filter === 'all') return true;
    return vote.status === filter;
  });

  const handleEdit = (voteId: string) => {
    console.log('Edit proposal:', voteId);
  };

  const handleDelete = (voteId: string) => {
    console.log('Delete proposal:', voteId);
  };

  const handleViewStats = (voteId: string) => {
    router.push(`/vote/${voteId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Proposals</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        <FilterButton
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
          count={mockVotes.length}
        />
        <FilterButton
          label="Active"
          active={filter === 'active'}
          onPress={() => setFilter('active')}
          count={mockVotes.filter((v) => v.status === 'active').length}
        />
        <FilterButton
          label="Upcoming"
          active={filter === 'upcoming'}
          onPress={() => setFilter('upcoming')}
          count={mockVotes.filter((v) => v.status === 'upcoming').length}
        />
        <FilterButton
          label="Ended"
          active={filter === 'ended'}
          onPress={() => setFilter('ended')}
          count={mockVotes.filter((v) => v.status === 'ended').length}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {filteredVotes.length > 0 ? (
          filteredVotes.map((vote) => (
            <ProposalCard
              key={vote.id}
              vote={vote}
              onEdit={() => handleEdit(vote.id)}
              onDelete={() => handleDelete(vote.id)}
              onViewStats={() => handleViewStats(vote.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="No Proposals Found"
            description="No proposals match the selected filter"
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
    <TouchableOpacity
      style={[styles.filterButton, active && styles.filterButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.filterButtonText,
          active && styles.filterButtonTextActive,
        ]}>
        {label}
      </Text>
      <View
        style={[styles.filterBadge, active && styles.filterBadgeActive]}>
        <Text
          style={[
            styles.filterBadgeText,
            active && styles.filterBadgeTextActive,
          ]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
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
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: '#DC2626',
  },
  filterButtonText: {
    fontSize: 12,
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
    minWidth: 28,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterBadgeText: {
    fontSize: 11,
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
