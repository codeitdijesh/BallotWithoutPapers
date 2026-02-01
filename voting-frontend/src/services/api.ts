import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const registerVoter = async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/api/voters/register`, data);
    return response.data;
};

export const loginAdmin = async (credentials: any) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    return response.data;
};

export const createElection = async (data: any, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/elections`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getPendingVoters = async (electionId: string | number, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/voters/${electionId}/pending`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const approveVoter = async (voterId: string | number, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/voters/${voterId}/approve`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const syncVoterToBlockchain = async (electionId: string | number, voterId: string | number, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/voters/${voterId}/sync`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const manageElectionPhase = async (electionId: string | number, phase: string, token: string) => {
    const response = await axios.put(`${API_BASE_URL}/api/elections/${electionId}/phase`, { phase }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const checkEligibility = async (electionId: string | number, walletAddress: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/voters/eligibility/${electionId}/${walletAddress}`);
    return response.data;
};

export const commitVote = async (hash: string, contract: any) => {
    const response = await contract.commitVote(hash);
    return response;
};

export const revealVote = async (candidateId: number, salt: string, contract: any) => {
    const response = await contract.revealVote(candidateId, salt);
    return response;
};

export const getElectionResults = async (electionId: string | number) => {
    const response = await axios.get(`${API_BASE_URL}/api/elections/${electionId}/results`);
    return response.data;
};

export const fetchElections = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/elections`);
    return response.data;
};

export const fetchElectionResults = async (electionId: string | number) => {
    const response = await axios.get(`${API_BASE_URL}/api/elections/${electionId}/results`);
    return response.data;
};