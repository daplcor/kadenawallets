import { useWalletConnectClient } from '../wc/providers/ClientContextProvider';
import { create } from 'zustand';

const useWalletConnectStore = create(set => ({
  selectedAccount: null,
  signingType: 'sign',
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setSigningType: (type) => set({ signingType: type })
}));

export const useWalletConnect = () => {
  const {
    selectedAccount,
    signingType,
    setSelectedAccount,
    setSigningType
  } = useWalletConnectStore();
  const { session, connect, disconnect, isInitializing } = useWalletConnectClient();

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return {
    session,
    selectedAccount,
    signingType,
    isInitializing,
    setSelectedAccount,
    setSigningType,
    handleConnect,
    handleDisconnect
  }
};

export const useWalletConnection = (providerId) => {
  const { handleConnect, handleDisconnect } = useWalletConnect();

  // Function to establish a connection with WalletConnect
  const connectWithWalletConnect = async () => {
    handleConnect();
  };

  // Now, connectWithWalletConnect can be called within a component
  return { connectWithWalletConnect };
};