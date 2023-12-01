import { create } from 'zustand';

const messageStore = create((set) => ({

    messages: [],
    unreadMessagesCount: 0,
    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],
        unreadMessagesCount: state.unreadMessagesCount + 1,
      })),
    markAsRead: () =>
      set((state) => ({
        unreadMessagesCount: 0,
      })),
    
  }));

  export default messageStore;