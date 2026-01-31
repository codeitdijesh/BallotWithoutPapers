import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Vote } from '@/types';
import { Edit, Trash2, BarChart3 } from 'lucide-react-native';

interface ProposalCardProps {
  vote: Vote;
  onEdit: () => void;
  onDelete: () => void;
  onViewStats: () => void;
}

export default function ProposalCard({
  vote,
  onEdit,
  onDelete,
  onViewStats,
}: ProposalCardProps) {
  const getStatusColor = (status: Vote['status']) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'upcoming':
        return '#F59E0B';
      case 'ended':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {vote.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(vote.status)}20` },
          ]}>
          <Text
            style={[styles.statusText, { color: getStatusColor(vote.status) }]}>
            {vote.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{vote.totalVotes}</Text>
          <Text style={styles.statLabel}>Total Votes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{vote.participationRate}%</Text>
          <Text style={styles.statLabel}>Participation</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{vote.options.length}</Text>
          <Text style={styles.statLabel}>Options</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onViewStats}
          activeOpacity={0.7}>
          <BarChart3 size={18} color="#2563EB" />
          <Text style={styles.actionText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          activeOpacity={0.7}>
          <Edit size={18} color="#10B981" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
          activeOpacity={0.7}>
          <Trash2 size={18} color="#EF4444" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
