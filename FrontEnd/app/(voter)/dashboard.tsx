import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingUp, Clock, CheckCircle, Award } from 'lucide-react-native';
import { mockVotes, mockUser } from '@/constants/mockData';
import VoteCard from '@/components/VoteCard';
import MetricCard from '@/components/MetricCard';

export default function DashboardScreen() {
  const router = useRouter();

  const activeVotes = mockVotes.filter((vote) => vote.status === 'active');
  const upcomingVotes = mockVotes.filter((vote) => vote.status === 'upcoming');
  const userVotedCount = mockVotes.filter((vote) => vote.hasUserVoted).length;

  const handleVotePress = (voteId: string) => {
    router.push(`/vote/${voteId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{mockUser.name}</Text>
        </View>
        <View style={styles.walletBadge}>
          <View style={styles.walletDot} />
          <Text style={styles.walletText}>Connected</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <View style={styles.halfMetric}>
              <MetricCard
                title="Voting Power"
                value={mockUser.votingPower}
                icon={TrendingUp}
                color="#2563EB"
              />
            </View>
            <View style={styles.halfMetric}>
              <MetricCard
                title="Total Votes"
                value={userVotedCount}
                icon={CheckCircle}
                color="#10B981"
              />
            </View>
          </View>
          <View style={styles.metricRow}>
            <View style={styles.halfMetric}>
              <MetricCard
                title="Active"
                value={activeVotes.length}
                icon={Clock}
                color="#F59E0B"
              />
            </View>
            <View style={styles.halfMetric}>
              <MetricCard
                title="Rank"
                value="#342"
                icon={Award}
                color="#8B5CF6"
                subtitle="Top 20%"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Votes</Text>
          {activeVotes.length > 0 ? (
            activeVotes.map((vote) => (
              <VoteCard
                key={vote.id}
                vote={vote}
                onPress={() => handleVotePress(vote.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No active votes at the moment</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Votes</Text>
          {upcomingVotes.length > 0 ? (
            upcomingVotes.map((vote) => (
              <VoteCard
                key={vote.id}
                vote={vote}
                onPress={() => handleVotePress(vote.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No upcoming votes scheduled
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  walletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  walletText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  metricsGrid: {
    marginBottom: 24,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfMetric: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
