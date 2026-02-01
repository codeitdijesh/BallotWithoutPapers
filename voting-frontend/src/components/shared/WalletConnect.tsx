import React from 'react';
import useWallet from '../../hooks/useWallet';

const WalletConnect: React.FC = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="wallet-connect">
      {isConnected && account ? (
        <div>
          <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default WalletConnect;