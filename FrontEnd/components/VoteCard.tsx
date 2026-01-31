import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Vote } from '@/types';
import { Calendar, Users, CheckCircle } from 'lucide-react-native';

interface VoteCardProps {
  vote: Vote;
  onPress: () => void;
}

export default function VoteCard({ vote, onPress }: VoteCardProps) {
  const getCategoryColor = (category: Vote['category']) => {
    switch (category) {
      case 'governance':
        return '#2563EB';
      case 'community':
        return '#10B981';
      case 'financial':
        return '#F59E0B';
      case 'technical':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: `${getCategoryColor(vote.category)}20` },
          ]}>
          <Text
            style={[
              styles.categoryText,
              { color: getCategoryColor(vote.category) },
            ]}>
            {vote.category.toUpperCase()}
          </Text>
        </View>
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

      <Text style={styles.title}>{vote.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {vote.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.statText}>
            {formatDate(vote.startDate)} - {formatDate(vote.endDate)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.statText}>{vote.totalVotes} votes</Text>
        </View>
        {vote.hasUserVoted && (
          <View style={styles.votedBadge}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.votedText}>Voted</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
  },
  votedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  votedText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
});
