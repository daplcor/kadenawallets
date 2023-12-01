import { create } from 'zustand'


const walletConnectStore = create((set) => ({
  showModal: false,
  setshowConnectWalletModal: () => set(() => ({ showModal: true })),
  sethideConnectWalletModal: () => set(() => ({ showModal: false })),
}));
export const {
  setshowConnectWalletModal,
  sethideConnectWalletModal,
} = walletConnectStore;

export const connectWithProvider = () => {
  return (dispatch, getState) => {
    const { provider } = getState().walletConnect;
    if (provider) {
      dispatch(sethideConnectWalletModal(true));
      dispatch(setProvider(provider));
    }
  };
}

export default walletConnectStore;