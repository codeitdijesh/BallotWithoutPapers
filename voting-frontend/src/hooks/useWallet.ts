import { useEffect, useState } from 'react';

const useWallet = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                setIsConnected(true);
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsConnected(false);
    };

    useEffect(() => {
        // Listen for account changes
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsConnected(true);
            } else {
                setAccount(null);
                setIsConnected(false);
            }
        };

        const handleDisconnect = () => {
            setAccount(null);
            setIsConnected(false);
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('disconnect', handleDisconnect);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('disconnect', handleDisconnect);
            }
        };
    }, []);

    return { account, isConnected, connectWallet, disconnectWallet };
};

export default useWallet;