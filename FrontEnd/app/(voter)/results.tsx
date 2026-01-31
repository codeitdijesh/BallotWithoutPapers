import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BarChart3 } from 'lucide-react-native';
import { mockVotes } from '@/constants/mockData';
import VoteCard from '@/components/VoteCard';
import EmptyState from '@/components/EmptyState';

export default function ResultsScreen() {
  const router = useRouter();

  const endedVotes = mockVotes.filter((vote) => vote.status === 'ended');

  const handleVotePress = (voteId: string) => {
    router.push(`/vote/${voteId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Past Results</Text>
        <Text style={styles.headerSubtitle}>
          {endedVotes.length} completed {endedVotes.length === 1 ? 'vote' : 'votes'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {endedVotes.length > 0 ? (
          endedVotes.map((vote) => (
            <VoteCard
              key={vote.id}
              vote={vote}
              onPress={() => handleVotePress(vote.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No Past Results"
            description="There are no completed votes to display yet"
          />
        )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
});
