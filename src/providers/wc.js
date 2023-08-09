import { getSdkError } from "@walletconnect/utils";
import { useState, useEffect, createContext, useContext } from "react";
// import Client from "@walletconnect/client";
import { accountStore } from "../store/kadenaSlice";
import { useWalletConnectClient } from "../wc/providers/ClientContextProvider";

export const WC = 'WC';
const networkId = 'mainnet01';

const wc = {
  name: 'wc',
  connect: async function() {
    const { client, session, connect } = useWalletConnectClient();
    // Use WalletConnect client to connect to the wallet
    await connect();

    if (client && session) {
      const fullAccountString = session.namespaces.kadena.accounts[0];
      const pubKey = fullAccountString.split(":").slice(2).join(":");
      const account = `k:${pubKey}`;
      // console.log("pb", pubKey);
      // Save the session data and account data to the Zustand store.
      accountStore.setState({
        session,
        account,
        pubKey,
      });
      return account;
    } else {
      throw new Error("Failed to connect to the wallet");
    }
  },
  disconnect: async function() {
    const { client, disconnect } = useWalletConnectClient();

    if (client) {
      // Use WalletConnect client to disconnect from the wallet
      await disconnect();
      return;
    } else {
      throw new Error("WalletConnect client is not initialized");
    }
  },
  sign: async function(signingCommand) {
    const { client, session } = useWalletConnectClient();
    if (client && session) {
      const request = {
        topic: session.topic,
        chainId: `kadena:mainnet01`,
        request: {
          method: "kadena_sign_v1", // use the Kadena signing method
          params: signingCommand, // directly pass the signingCommand
        },
      };
  
      try {
        // Use WalletConnect client to send signing request to the wallet
        const result = await client.request(request);
        return result; // The signed message
      } catch (error) {
        console.error("Error during signing:", error);
        throw error;
      }
    } else {
      throw new Error("WalletConnect client is not initialized or session is not connected");
    }
  },
  
};

export default wc;
