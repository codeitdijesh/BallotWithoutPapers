export interface Vote {
  id: string;
  title: string;
  description: string;
  category: 'governance' | 'community' | 'financial' | 'technical';
  status: 'active' | 'upcoming' | 'ended';
  startDate: string;
  endDate: string;
  totalVotes: number;
  participationRate: number;
  options: VoteOption[];
  createdBy: string;
  hasUserVoted: boolean;
  userChoice?: string;
}

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface User {
  id: string;
  name: string;
  walletAddress?: string;
  isAdmin: boolean;
  votingPower: number;
  totalVotes: number;
}

export interface AdminMetrics {
  totalProposals: number;
  activeVotes: number;
  totalParticipants: number;
  averageParticipation: number;
}
