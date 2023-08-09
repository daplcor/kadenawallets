// import kadenaStore, {networkId} from "../store/kadenaSlice";
import Pact from "pact-lang-api";
import { useState } from "react";


export const X_WALLET = 'X_WALLET';
const networkId = 'mainnet01';
const xwallet = {
  name: 'X Wallet',
  connect: async function() {
    let accountResult = await kadena.request({
      method: "kda_connect",
      networkId: networkId,
    });
    return accountResult;
  },
  disconnect: async function() {
    return await kadena.request({
      method: "kda_disconnect",
      networkId: networkId,
    });
  },
  sign: async function(signingCommand) {
    let networkId = 'mainnet01';
    let req = {
      method: "kda_requestSign",
      networkId: networkId,
      data: {
          networkId: networkId,
          signingCmd: signingCommand
      }
    }
    var cmd = await window.kadena.request(req);
    
    return cmd.signedCmd;
  }
}
export default xwallet;