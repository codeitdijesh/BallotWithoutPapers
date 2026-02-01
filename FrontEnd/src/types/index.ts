export type VoteStatus = 'active' | 'upcoming' | 'ended';
export type VoteCategory = 'governance' | 'community' | 'financial' | 'technical';
export type UserRole = 'voter' | 'admin';

export interface VoteOption {
  id: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  category: VoteCategory;
  status: VoteStatus;
  startDate: string;
  endDate: string;
  totalVotes: number;
  options: VoteOption[];
  hasVoted: boolean;
  userVote?: string;
  quorum: number;
  currentParticipation: number;
}

export interface UserMetrics {
  votingPower: number;
  totalVotes: number;
  activeVotes: number;
  rank: number;
  totalUsers: number;
}

export interface AdminMetrics {
  totalProposals: number;
  activeProposals: number;
  totalParticipants: number;
  averageParticipation: number;
}

export interface User {
  id: string;
  walletAddress: string;
  displayName: string;
  role: UserRole;
  joinDate: string;
  metrics: UserMetrics;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}
