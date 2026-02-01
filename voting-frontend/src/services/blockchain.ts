import { ethers, BrowserProvider } from 'ethers';
import ElectionArtifact from '../contracts/Election.json';

const getContract = async (provider: BrowserProvider) => {
    const networkId = process.env.REACT_APP_NETWORK_ID || '5777'; // Default to Hardhat network
    const contractAddress = (ElectionArtifact as any).networks?.[networkId]?.address || '';
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, (ElectionArtifact as any).abi, signer);
    return contract;
};

export const commitVote = async (provider: BrowserProvider, candidateId: number, salt: string) => {
    const contract = await getContract(provider);
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const hash = ethers.keccak256(abiCoder.encode(['uint256', 'string'], [candidateId, salt]));
    const transaction = await contract.commitVote(hash);
    await transaction.wait();
};

export const revealVote = async (provider: BrowserProvider, candidateId: number, salt: string) => {
    const contract = await getContract(provider);
    const transaction = await contract.revealVote(candidateId, salt);
    await transaction.wait();
};

export const checkEligibility = async (provider: BrowserProvider, electionId: number, walletAddress: string) => {
    const contract = await getContract(provider);
    const isEligible = await contract.isEligible(electionId, walletAddress);
    return isEligible;
};