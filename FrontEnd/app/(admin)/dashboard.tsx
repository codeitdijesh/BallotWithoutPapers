import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  FileText,
  Vote,
  Users,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
} from 'lucide-react-native';
import { mockVotes, mockAdminMetrics } from '@/constants/mockData';
import MetricCard from '@/components/MetricCard';
import ProposalCard from '@/components/ProposalCard';

export default function AdminDashboardScreen() {
  const router = useRouter();

  const handleCreateProposal = () => {
    router.push('/(admin)/create');
  };

  const handleManageProposals = () => {
    router.push('/(admin)/manage');
  };

  const handleEditProposal = (voteId: string) => {
    console.log('Edit proposal:', voteId);
  };

  const handleDeleteProposal = (voteId: string) => {
    console.log('Delete proposal:', voteId);
  };

  const handleViewStats = (voteId: string) => {
    router.push(`/vote/${voteId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage voting proposals and view analytics</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionPrimary}
            onPress={handleCreateProposal}
            activeOpacity={0.8}>
            <Plus size={24} color="#FFFFFF" strokeWidth={3} />
            <Text style={styles.quickActionPrimaryText}>Create Proposal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionSecondary}
            onPress={handleManageProposals}
            activeOpacity={0.8}>
            <BarChart3 size={24} color="#2563EB" strokeWidth={2} />
            <Text style={styles.quickActionSecondaryText}>Manage All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <MetricCard
            title="Total Proposals"
            value={mockAdminMetrics.totalProposals}
            icon={FileText}
            color="#2563EB"
          />
          <MetricCard
            title="Active Votes"
            value={mockAdminMetrics.activeVotes}
            icon={Vote}
            color="#10B981"
          />
          <MetricCard
            title="Total Participants"
            value={mockAdminMetrics.totalParticipants.toLocaleString()}
            icon={Users}
            color="#F59E0B"
          />
          <MetricCard
            title="Avg. Participation"
            value={`${mockAdminMetrics.averageParticipation}%`}
            icon={TrendingUp}
            color="#8B5CF6"
          />
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Proposals</Text>
          {mockVotes.slice(0, 3).map((vote) => (
            <ProposalCard
              key={vote.id}
              vote={vote}
              onEdit={() => handleEditProposal(vote.id)}
              onDelete={() => handleDeleteProposal(vote.id)}
              onViewStats={() => handleViewStats(vote.id)}
            />
          ))}
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
    backgroundColor: '#DC2626',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  settingsButton: {
    padding: 4,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  adminBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#FEE2E2',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionPrimary: {
    flex: 2,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  quickActionSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionSecondaryText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  metricsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  recentSection: {
    marginBottom: 24,
  },
});
