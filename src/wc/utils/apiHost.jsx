import { networkMap } from "./networkMap"

/**
 * Composes the apiHost
 *
 * @param [chainId='1']
 * @param [network='testnet']
 * @param [apiVersion='0.0']
 * @return
 */
export function apiHost(
  chainId = "8",
  network = "mainnet01",
  apiVersion = "0.0"
) {
  return `https://${networkMap[network].api}/chainweb/${apiVersion}/${network}/chain/${chainId}/pact`
}
