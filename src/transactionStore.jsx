import { create } from 'zustand';

// Initial state
const initialState = {
  isLoading: false,
  transactionHash: null,
  transactionResult: null,
  error: null,
};

// Actions
const actions = (set) => ({
  setLoading: (isLoading) => set({ isLoading }),
  setTransactionHash: (transactionHash) => set({ transactionHash }),
  setTransactionResult: (transactionResult) => set({ transactionResult }),
  setError: (error) => set({ error }),
  clear: () => set({ ...initialState }),
});

// Create the store
export const transactionStore = create(set => ({ ...initialState, ...actions(set) }));
