import { Vote, User, AdminMetrics, Feature, Stat } from '@/types';

export const mockVotes: Vote[] = [
  {
    id: '1',
    title: 'Treasury Allocation Q1 2026',
    description: 'Proposal to allocate 500,000 tokens from the community treasury for ecosystem development grants, marketing initiatives, and infrastructure improvements.',
    category: 'financial',
    status: 'active',
    startDate: '2026-01-25',
    endDate: '2026-02-05',
    totalVotes: 15420,
    options: [
      { id: 'a', label: 'Approve Full Allocation', votes: 9252, percentage: 60 },
      { id: 'b', label: 'Approve Partial (50%)', votes: 4626, percentage: 30 },
      { id: 'c', label: 'Reject Proposal', votes: 1542, percentage: 10 },
    ],
    hasVoted: false,
    quorum: 20000,
    currentParticipation: 77,
  },
  {
    id: '2',
    title: 'Protocol Upgrade v2.5',
    description: 'Technical upgrade implementing improved consensus mechanism, reduced transaction fees by 40%, and enhanced smart contract capabilities.',
    category: 'technical',
    status: 'active',
    startDate: '2026-01-20',
    endDate: '2026-02-01',
    totalVotes: 22150,
    options: [
      { id: 'a', label: 'Approve Upgrade', votes: 18822, percentage: 85 },
      { id: 'b', label: 'Delay for Review', votes: 2215, percentage: 10 },
      { id: 'c', label: 'Reject Upgrade', votes: 1113, percentage: 5 },
    ],
    hasVoted: true,
    userVote: 'a',
    quorum: 25000,
    currentParticipation: 89,
  },
  {
    id: '3',
    title: 'Community Ambassador Program',
    description: 'Establish a global ambassador program to increase community engagement, with monthly rewards and exclusive benefits for active contributors.',
    category: 'community',
    status: 'upcoming',
    startDate: '2026-02-10',
    endDate: '2026-02-20',
    totalVotes: 0,
    options: [
      { id: 'a', label: 'Launch Program', votes: 0, percentage: 0 },
      { id: 'b', label: 'Modify Terms First', votes: 0, percentage: 0 },
      { id: 'c', label: 'Postpone Launch', votes: 0, percentage: 0 },
    ],
    hasVoted: false,
    quorum: 15000,
    currentParticipation: 0,
  },
  {
    id: '4',
    title: 'Governance Framework Update',
    description: 'Revise the governance framework to implement quadratic voting, reduce proposal threshold, and add emergency voting procedures.',
    category: 'governance',
    status: 'active',
    startDate: '2026-01-22',
    endDate: '2026-02-02',
    totalVotes: 18300,
    options: [
      { id: 'a', label: 'Implement All Changes', votes: 10980, percentage: 60 },
      { id: 'b', label: 'Quadratic Voting Only', votes: 5490, percentage: 30 },
      { id: 'c', label: 'No Changes', votes: 1830, percentage: 10 },
    ],
    hasVoted: true,
    userVote: 'a',
    quorum: 20000,
    currentParticipation: 92,
  },
  {
    id: '5',
    title: 'Partnership with DeFi Protocol',
    description: 'Strategic partnership proposal with leading DeFi protocol for liquidity integration and cross-platform governance rights.',
    category: 'financial',
    status: 'ended',
    startDate: '2026-01-05',
    endDate: '2026-01-15',
    totalVotes: 28500,
    options: [
      { id: 'a', label: 'Approve Partnership', votes: 22800, percentage: 80 },
      { id: 'b', label: 'Renegotiate Terms', votes: 4275, percentage: 15 },
      { id: 'c', label: 'Decline Partnership', votes: 1425, percentage: 5 },
    ],
    hasVoted: true,
    userVote: 'a',
    quorum: 20000,
    currentParticipation: 100,
  },
];

export const mockUser: User = {
  id: '1',
  walletAddress: '0x1234...5678',
  displayName: 'BlockVoter',
  role: 'voter',
  joinDate: '2025-06-15',
  metrics: {
    votingPower: 2500,
    totalVotes: 47,
    activeVotes: 3,
    rank: 142,
    totalUsers: 15420,
  },
};

export const mockAdminUser: User = {
  id: '2',
  walletAddress: '0xABCD...EFGH',
  displayName: 'GovernanceAdmin',
  role: 'admin',
  joinDate: '2024-12-01',
  metrics: {
    votingPower: 10000,
    totalVotes: 156,
    activeVotes: 5,
    rank: 8,
    totalUsers: 15420,
  },
};

export const mockAdminMetrics: AdminMetrics = {
  totalProposals: 89,
  activeProposals: 5,
  totalParticipants: 15420,
  averageParticipation: 78,
};

export const features: Feature[] = [
  {
    icon: 'Shield',
    title: 'Secure & Transparent',
    description: 'Every vote is immutably recorded on the blockchain, ensuring complete transparency and preventing any tampering.',
  },
  {
    icon: 'Users',
    title: 'Democratic Governance',
    description: 'Token holders have proportional voting power, ensuring fair representation in all community decisions.',
  },
  {
    icon: 'Zap',
    title: 'Lightning Fast',
    description: 'Vote instantly with minimal transaction fees. Results are calculated in real-time as votes are cast.',
  },
  {
    icon: 'Lock',
    title: 'Privacy Preserved',
    description: 'Optional private voting ensures your choices remain confidential while maintaining verifiability.',
  },
];

export const stats: Stat[] = [
  { value: '15,420', label: 'Active Voters' },
  { value: '89', label: 'Proposals Created' },
  { value: '2.1M', label: 'Votes Cast' },
  { value: '99.9%', label: 'Uptime' },
];
