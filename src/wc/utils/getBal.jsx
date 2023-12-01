import { PactCommand } from "@kadena/client"
import { apiHost } from "./apiHost"

export async function getBalance(account, network, chainId) {
  const pactCommand = new PactCommand()

  pactCommand.code = `(coin.get-balance "${account}")`
  pactCommand.setMeta({ sender: account, chainId }, network)

  const response = await pactCommand.local(apiHost(chainId, network), {
    signatureVerification: false,
    preflight: false
  })

  return {
    account,
    chain: chainId,
    balance: response.result.data
  }
}
