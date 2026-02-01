export interface Voter {
    id: number;
    organizationId: string;
    fullName: string;
    email: string;
    walletAddress: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Election {
    id: number;
    name: string;
    description: string;
    candidates: Candidate[];
    status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Candidate {
    id: number;
    name: string;
}

export interface Vote {
    voterId: number;
    candidateId: number;
    salt: string;
}

export interface ElectionResults {
    electionId: number;
    results: Record<number, number>; // candidateId -> voteCount
}