import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react-native';
import { mockVotes } from '@/constants/mockData';
import Button from '@/components/Button';

export default function VoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const vote = mockVotes.find((v) => v.id === id);

  const [selectedOption, setSelectedOption] = useState<string | null>(
    vote?.userChoice || null
  );
  const [isVoting, setIsVoting] = useState(false);

  if (!vote) {
    return (
      <View style={styles.container}>
        <Text>Vote not found</Text>
      </View>
    );
  }

  const handleVote = () => {
    if (!selectedOption) {
      Alert.alert('No Option Selected', 'Please select an option to vote.');
      return;
    }

    setIsVoting(true);
    setTimeout(() => {
      setIsVoting(false);
      Alert.alert(
        'Vote Submitted!',
        'Your vote has been recorded on the blockchain.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(vote.endDate);
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return 'Ending soon';
  };

  const getCategoryColor = (category: string) => {
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

  const canVote = vote.status === 'active' && !vote.hasUserVoted;
  const isEnded = vote.status === 'ended';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vote Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
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

        <Text style={styles.title}>{vote.title}</Text>
        <Text style={styles.description}>{vote.description}</Text>

        <View style={styles.metaSection}>
          <MetaItem icon={Calendar} label="Period">
            <Text style={styles.metaValue}>
              {formatDate(vote.startDate)} - {formatDate(vote.endDate)}
            </Text>
          </MetaItem>
          <MetaItem icon={Users} label="Participation">
            <Text style={styles.metaValue}>
              {vote.totalVotes} votes ({vote.participationRate}%)
            </Text>
          </MetaItem>
          <MetaItem icon={TrendingUp} label="Created By">
            <Text style={styles.metaValue}>{vote.createdBy}</Text>
          </MetaItem>
          {vote.status === 'active' && (
            <MetaItem icon={Clock} label="Time Left">
              <Text style={[styles.metaValue, styles.timeRemaining]}>
                {getTimeRemaining()}
              </Text>
            </MetaItem>
          )}
        </View>

        {vote.hasUserVoted && (
          <View style={styles.votedBanner}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.votedBannerText}>
              You have already voted on this proposal
            </Text>
          </View>
        )}

        <View style={styles.optionsSection}>
          <Text style={styles.optionsTitle}>
            {isEnded ? 'Final Results' : 'Voting Options'}
          </Text>
          {vote.options.map((option) => (
            <VoteOption
              key={option.id}
              option={option}
              selected={selectedOption === option.id}
              onSelect={() => canVote && setSelectedOption(option.id)}
              disabled={!canVote}
              showResults={isEnded || vote.hasUserVoted}
            />
          ))}
        </View>

        {canVote && (
          <Button
            title={isVoting ? 'Submitting Vote...' : 'Submit Vote'}
            onPress={handleVote}
            variant="primary"
            size="large"
            fullWidth
            loading={isVoting}
            disabled={!selectedOption}
          />
        )}
      </ScrollView>
    </View>
  );
}

function MetaItem({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<any>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaIcon}>
        <Icon size={18} color="#6B7280" />
      </View>
      <View style={styles.metaContent}>
        <Text style={styles.metaLabel}>{label}</Text>
        {children}
      </View>
    </View>
  );
}

function VoteOption({
  option,
  selected,
  onSelect,
  disabled,
  showResults,
}: {
  option: any;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
  showResults: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        selected && styles.optionSelected,
        disabled && styles.optionDisabled,
      ]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}>
      <View style={styles.optionHeader}>
        <View style={styles.optionRadio}>
          {selected && <View style={styles.optionRadioSelected} />}
        </View>
        <Text style={styles.optionText}>{option.text}</Text>
      </View>
      {showResults && (
        <View style={styles.optionResults}>
          <View style={styles.resultBar}>
            <View
              style={[styles.resultFill, { width: `${option.percentage}%` }]}
            />
          </View>
          <Text style={styles.resultText}>
            {option.votes} votes ({option.percentage}%)
          </Text>
        </View>
      )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  metaSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  metaContent: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 2,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  timeRemaining: {
    color: '#F59E0B',
  },
  votedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  votedBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  optionsSection: {
    marginBottom: 24,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionDisabled: {
    opacity: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  optionResults: {
    marginTop: 12,
  },
  resultBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  resultFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  resultText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});
