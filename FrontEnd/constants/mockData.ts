import { Vote, User, AdminMetrics } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Morgan',
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  isAdmin: false,
  votingPower: 100,
  totalVotes: 12,
};

export const mockAdminUser: User = {
  id: 'admin1',
  name: 'Admin User',
  walletAddress: '0x892f48Dd7734D0532925a3b844Bc9e7595f0cFa',
  isAdmin: true,
  votingPower: 500,
  totalVotes: 45,
};

export const mockVotes: Vote[] = [
  {
    id: '1',
    title: 'Community Treasury Allocation 2024',
    description:
      'Decide how to allocate 500,000 tokens from the community treasury for development and marketing initiatives in Q2 2024.',
    category: 'financial',
    status: 'active',
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-02-05T23:59:59Z',
    totalVotes: 1247,
    participationRate: 68.5,
    hasUserVoted: false,
    createdBy: 'Core Team',
    options: [
      { id: 'o1', text: 'Development (60%) / Marketing (40%)', votes: 523, percentage: 42 },
      { id: 'o2', text: 'Development (50%) / Marketing (50%)', votes: 448, percentage: 36 },
      { id: 'o3', text: 'Development (70%) / Marketing (30%)', votes: 276, percentage: 22 },
    ],
  },
  {
    id: '2',
    title: 'Implement Quadratic Voting Mechanism',
    description:
      'Proposal to adopt quadratic voting for future governance decisions to ensure fair representation.',
    category: 'governance',
    status: 'active',
    startDate: '2024-01-22T00:00:00Z',
    endDate: '2024-02-08T23:59:59Z',
    totalVotes: 892,
    participationRate: 49.2,
    hasUserVoted: true,
    userChoice: 'o1',
    createdBy: 'DAO Member #4521',
    options: [
      { id: 'o1', text: 'Yes, implement quadratic voting', votes: 634, percentage: 71 },
      { id: 'o2', text: 'No, keep current system', votes: 258, percentage: 29 },
    ],
  },
  {
    id: '3',
    title: 'New Partnership with DeFi Protocol',
    description:
      'Vote to approve strategic partnership with a leading DeFi protocol for cross-chain integration.',
    category: 'community',
    status: 'upcoming',
    startDate: '2024-02-10T00:00:00Z',
    endDate: '2024-02-20T23:59:59Z',
    totalVotes: 0,
    participationRate: 0,
    hasUserVoted: false,
    createdBy: 'Partnership Committee',
    options: [
      { id: 'o1', text: 'Approve partnership', votes: 0, percentage: 0 },
      { id: 'o2', text: 'Reject partnership', votes: 0, percentage: 0 },
      { id: 'o3', text: 'Request more information', votes: 0, percentage: 0 },
    ],
  },
  {
    id: '4',
    title: 'Protocol Upgrade to v2.0',
    description:
      'Major protocol upgrade including gas optimization and new features. This is a critical technical vote.',
    category: 'technical',
    status: 'ended',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-15T23:59:59Z',
    totalVotes: 2105,
    participationRate: 82.3,
    hasUserVoted: true,
    userChoice: 'o1',
    createdBy: 'Technical Committee',
    options: [
      { id: 'o1', text: 'Approve upgrade', votes: 1893, percentage: 90 },
      { id: 'o2', text: 'Reject upgrade', votes: 212, percentage: 10 },
    ],
  },
  {
    id: '5',
    title: 'Community Event Sponsorship',
    description:
      'Should we sponsor the upcoming blockchain conference with 50,000 tokens?',
    category: 'community',
    status: 'ended',
    startDate: '2024-01-05T00:00:00Z',
    endDate: '2024-01-18T23:59:59Z',
    totalVotes: 1567,
    participationRate: 71.2,
    hasUserVoted: false,
    createdBy: 'Marketing Team',
    options: [
      { id: 'o1', text: 'Yes, sponsor the event', votes: 1021, percentage: 65 },
      { id: 'o2', text: 'No, save the funds', votes: 546, percentage: 35 },
    ],
  },
];

export const mockAdminMetrics: AdminMetrics = {
  totalProposals: 47,
  activeVotes: 2,
  totalParticipants: 1821,
  averageParticipation: 64.7,
};
