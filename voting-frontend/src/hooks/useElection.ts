import { useState, useEffect } from 'react';
import { fetchElections, fetchElectionResults } from '../services/api';

const useElection = (electionId: string | number) => {
    const [election, setElection] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const getElectionData = async () => {
            try {
                const electionData = await fetchElections();
                setElection(electionData);
                const resultsData = await fetchElectionResults(electionId);
                setResults(resultsData);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (electionId) {
            getElectionData();
        }
    }, [electionId]);

    return { election, results, loading, error };
};

export default useElection;