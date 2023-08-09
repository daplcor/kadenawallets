import { useState } from 'react';
import providers from '../providers/providers';
import { createPactCommand, createSigningCommand, listen, localCommand, sendCommand } from '../utils/utils';
import { create } from 'zustand';
import walletConnectStore from './connectWalletModalSlice';
import { X_WALLET, ZELCORE, WC } from "../providers/providers";
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'react-toastify';
import { devtools } from 'zustand/middleware';
import Pact from 'pact-lang-api';
import { balanceStore } from './BalStore';
import { EVENT_WALLET_CONNECT } from '../constants/constants';
import { useWalletConnection} from './wcStore';
// import { set } from 'immer/dist/internal';

const zelCore = ZELCORE;

const kadenaStore = create((set, get) => ({
    messages: [],
    newMessage: {},
    requestKeys: [],
    transactions: [],
    newTransaction: {},
    contractAccount: '',
    netInfo: {
    contract: (import.meta.env.VITE_KU_NAMESPACE),
    chainId: Number(import.meta.env.VITE_CHAIN_ID),
    gasPrice: Number(import.meta.env.VITE_GAS_PRICE),
    gasLimit: Number(import.meta.env.VITE_GAS_LIMIT),
    network: 'https://api.chainweb.com',
    networkId: 'mainnet01',
    ttl: 600,
    },
    clearSession: () => set({}, true),
    setContractAccount: (contractAccount) =>
    set((state) => ({...state, contractAccount })),
    setRequestKeys: (requestKeys) =>
    set((state) => ({
      ...state,
      requestKeys,
    })),
    setNetwork: (network) =>
      set((state) => ([
        ...state,
        network,
      ])),
         setNetworkId: (networkId) =>
      set((state) => ([
        ...state,
        networkId,
      ])),
      setTtl: (setTtl) =>
      set((state) => ([
        ...state,
        setTtl,
      ])),
      setContract: (contract) =>
      set((state) => ([
        ...state,
        contract,
      ])),
     setTransactions: (transactions) =>
     set((state) => ([
      ...state,
        transactions,
     ])),
     setNewTransaction: (newTransaction) =>
     set((state) => ([
      ...state,
        newTransaction,
     ])),
      setChainId: (chainId) =>
      set((state) => ([
        ...state,
        chainId,
      ])),
      setgasPrice: (gasPrice) =>
      set((state) => ([
        ...state,
        gasPrice,
      ])),
      setgasLimit: (gasLimit) =>
      set((state) => ([
        ...state,
        gasLimit,   
      ])),
 
      addMessage: (messages) =>
      set((state) => ([
        ...state,
        messages,
      ])),
      setMessages: (messages) =>
      set((state) => ([
        ...state,
        messages,   
      ])),
      setNewMessage: (newMessage) =>
      set((state) => ([
        ...state,
        newMessage,   
      ])),
  }));



 

  export const accountStore = create(
    persist(
      (set, get) => ({
        account: '',
        session: undefined,
        guard: [],
        pubKey: '',
        provider: null,
        switchAccount: (newAccount) => {
          set(() => ({ account: newAccount.account }));
          set(() => ({ pubKey: newAccount.publicKey }));
          set(() => ({ guard: newAccount.guard }));
        },
        setAccount: (account) => set(() => ({ account })),
        setPubKey: (pubKey) => set(() => ({ pubKey })),
        setGuard: (guard) => set(() => ({ guard })),
        setProvider: (provider) => set(() => ({ provider })),
        providerActions: {
          setZelcore: () => set(() => ({ provider: ZELCORE })),
          setXWallet: () => set(() => ({ provider: X_WALLET })),
          setWC: () => set(() => ({ provider: WC })),
          clearProvider: () => set(() => ({ provider: null })),
        },
      }),
      {
        name: 'accountinfo', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    )
  );
  

export const { 
  setNetwork, setNetworkId, 
  addMessage, setNewMessage, setContract, setArtist, contract, netInfo
} = kadenaStore;



export const {
  setBalance, setAcount, setPubKey, setGuard, account, pubKey
} = accountStore;

export default kadenaStore;


export const connectWithProvider = (providerId) => {
  let networkId = kadenaStore.getState().netInfo.networkId;
  
  return async function(set, getState) {
    let provider = providers[providerId];
    let connectResult;

    try {
      if (providerId === 'WC') {
        connectResult = await useWalletConnection();
        // console.log("connectResult", connectResult);
      } else {
        connectResult = await provider.connect(getState);
      }

      if (connectResult.status === 'success') {
        accountStore.setState({ account: connectResult.account.account });
        accountStore.setState({ provider: [providerId]})
        accountStore.setState({ session: connectResult.session })
        walletConnectStore.setState({ showModal: false });
        accountStore.setState({ pubKey: connectResult.account.publicKey });
        kadenaStore.setState({ messages: 'We are connected yay!' });
        const event = new CustomEvent(EVENT_WALLET_CONNECT, { detail: providerId });
        document.dispatchEvent(event);
      }
      else {
        kadenaStore.setState({ messages: `Error: ${connectResult.message}. Make sure you are on ` })
        toast.error(`Error: ${connectResult.message}. Make sure you are on ${networkId}`); 
      }
    } catch (error) {
      console.log("Error during connection:", error);
    }
  }
};


const disconnectWalletConnect = () => {
  disconnect();
};

export const disconnectProvider = () => {
  let providerId = accountStore((state) => state.provider);
  let session = accountStore((state) => state.session);

  return async function(getState) {
    let provider = providers[providerId];
    
    try {
      let disconnectResult;
      
      if (providerId === 'WC') {
        // console.log("Attempting to disconnect with WalletConnect");
        disconnectResult = await disconnectWalletConnect();
      } else {
        // console.log("Attempting to disconnect with", provider);
        disconnectResult = await provider.disconnect(getState);
      }

      // console.log("Disconnect result:", disconnectResult);
  
      if (disconnectResult.result.status === 'success') {
        accountStore.setState({ 
          account: "",
          provider: null,
          pubKey: "",
          session: null,
        });
        kadenaStore.setState({ messages: `Successfully Disconnected from ${provider.name}` });
        // balanceStore.setState({ balance: 0 });
        toast.success(`Success: Disconnected from ${provider.name}`);
      }
      else {
        let networkId = kadenaStore((state) => state.networkId);
        kadenaStore.setState({ message: `Error: ${disconnectResult.message}. Make sure you are on ${networkId} ` });
        toast.error(`Error: ${disconnectResult.message}. Make sure you are on ${networkId}`);
      }
    } catch (error) {
      console.log("Error during disconnection:", error);
    }
  }
};

export const local = (chainId, pactCode, envData, caps=[], gasLimit=15000, gasPrice=1e-5, dontUpdate=false, sign=false) => {
   return async function(getState) {
    var cmd = {}
    if (sign) {
      let providerName = provider;
      if (providerName === '') {
        kadenaStore.setState({ message: `No wallet connected` });
                return;
      }
      
      let provider = providers[providerName];
      let signingCmd = createSigningCommand(
        getState, 
        chainId, 
        pactCode, 
        envData, 
        caps, 
        gasLimit, 
        gasPrice
      );
      // console.log(signingCmd);
      cmd = await provider.sign(getState, signingCmd);
    }
    else {
      cmd = createPactCommand(getState, chainId, pactCode, envData, gasLimit, gasPrice);
    }
    // console.log('cmd', cmd);

    if (dontUpdate) {
      let res = await localCommand(getState, chainId, cmd);
      // console.log(res);
      return res;
    }
    
    try {
      let res = await localCommand(getState, chainId, cmd);
      kadenaStore.setState({ transaction: (res) });
    
    }
    catch (e) {
      kadenaStore.setState({ message: `${e}` });
      
    }
  }
}

export const signAndSend = (chainId, pactCode, envData, 
  caps=[], gasLimit=15000, gasPrice=1e-5) => {
  return async function sign(dispatch, getState) {
    
    try {
      let providerName = accountStore.getState().provider;
      if (providerName === '') {
        dispatch(kadenaSlice.actions.addMessage({
          type: 'error',
          data: `No wallet connected`,
        }));
        return;
      }

      let provider = providers[providerName];
      let signingCmd = createSigningCommand(
        getState, 
        chainId, 
        pactCode, 
        envData, 
        caps, 
        gasLimit, 
        gasPrice
      );
      // console.log(signingCmd);
      let signedCmd = await provider.sign(getState, signingCmd);
      // console.log('signingCmd');
      // console.log(signedCmd);
      let res = await sendCommand(getState, chainId, signedCmd);
      // console.log(res);

      let reqKey = res.requestKeys[0];
      let reqListen = listen(getState, chainId, reqKey);
      let txData = {
        reqKey: reqKey,
        listenPromise: reqListen,
      };
      // console.log("tx data");
      // console.log(txData);
      dispatch(kadenaSlice.actions.addTransaction(txData));
    }
    catch (e) {
      dispatch(kadenaSlice.actions.addMessage({
        type: 'error',
        data: `Failed to sign command: ${e}`,
      }));
      // toast.error('Failed to sign command');
    }
  };
}

export const getBalance = (chainId, pactCode) => {
  let contract = 'coin';
      let account = accountStore((state) => state.account);
      let balance = accountStore((state) => state.balance);
  return async function( getState) {
      
      var pactCode = `
      (${contract}.get-balance ${account})
      `
      // console.log(pactCode);
      var result = await (local(chainId, pactCode, {}, [], balance))
      // console.log(result);
      
      if (result.status = 'success') {
          let balances = result.data[0];
      }
          else {
              toast.error(`Failed to load Balance data, error: ${result.data}`)
          }
      }
  }

 
  export const handleError = (error) => {
    console.log('ERROR:', error);
    return { errorMessage: 'Unhandled Exception' };
  };

  export const NETWORK = `${import.meta.env.VITE_KDA_NETWORK}/chainweb/${import.meta.env.VITE_KDA_NETWORK_VERSION}/${import.meta.env.VITE_NETWORK_ID}/chain/${import.meta.env.VITE_CHAIN_ID}/pact`;
 const creationTime = () => (Math.round(new Date().getTime() / 1000) - 10);
//  console.log("creation time", creationTime());
  export const pactFetchLocal = async (pactCode, options) => {
    let data = await Pact.fetch.local(
      {
        pactCode,
        meta: Pact.lang.mkMeta('', '1', Number(import.meta.env.VITE_GAS_PRICE), 150000, creationTime(), 600),
        ...options,
      },
      NETWORK
    );
    if (data.result.status === 'success') {
      return data.result.data;
    } else if (data.result.error.message) {
      const errorMessage = handleError(data);
      return { errorMessage: data.result.error.message || errorMessage };
    } else {
      return handleError(data);
    }
  };


export const loginDetails = async (account) => {
  if (providers !== null)
  try {
   const accBal = await pactFetchLocal(`(coin.details ${account})`);
    return accBal,
    accountStore.setState({ guard: JSON.stringify(accBal.guard) }), 
    balanceStore.setState({ balance: ~~accBal.balance })
    // console.log("ac", accBal)
    
  } catch (e) { 
    handleError(e);
  }
};




