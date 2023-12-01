
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
    // console.log("signingCommand did we?", );
    let networkId = 'mainnet01';
    let req = {
      method: "kda_requestSign",
      networkId: networkId,
      data: {
          networkId: networkId,
          signingCmd: signingCommand
      }
    }
    // console.log("req", req)
    var cmd = await window.kadena.request(req);
    // console.log("cmd inside try-catch:", cmd);

  
    return cmd.signedCmd;
  },
  quickSign: async function(signingCommand) {
    console.log("signingCommand did we?", signingCommand.signers );
    let networkId = 'mainnet01';
    const req = {
      method: "kda_requestQuickSign",
      networkId: networkId,
      data: {
        networkId: "mainnet01",
        commandSigDatas: [
          {
            sigs: signingCommand.signers, 
            cmd: JSON.stringify(signingCommand)
          }
        ]
      }
    }
    try {
    const cmd = await window.kadena.request(req);
    console.log("cmd", cmd)
    return cmd;
  
} catch (error) { 
  console.error("Error in xwallet sign function:", error);
}
}
}
export default xwallet;