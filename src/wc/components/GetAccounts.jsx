import { useWalletConnectClient } from "@/providers/ClientContextProvider"
import { getBalance } from "@/utils/getBalance"
import { Fragment, useEffect, useState } from "react"

export const GetAccounts = ({ selectedAccount, setSelectedAccount }) => {
  const { client, session, accounts } = useWalletConnectClient()

  const [isLoading, setIsLoading] = useState(false)
  const [kadenaAccounts, setKadenaAccounts] = useState()
  const [balances, setBalances] = useState([])
  const [
    selectedWalletConnectAccount,
    setSelectedWalletConnectAccount
  ] = useState("")
  const [onlyForCoinContract, setOnlyForCoinContract] = useState(false)

  useEffect(() => {
    if (!accounts) return

    setSelectedWalletConnectAccount(accounts[0])
  }, [accounts])

  const getBalances = (accounts, network) => {
    if (!accounts) return

    const balanceRequests = accounts?.reduce?.((acc, account) => {
      account.kadenaAccounts.forEach(kadenaAccount => {
        kadenaAccount.chains.forEach(chain => {
          acc.push(getBalance(kadenaAccount.name, network, chain))
        })
      })
      return acc
    }, [])

    Promise.all(balanceRequests).then(balances => {
      setBalances(balances)
    })
  }

  const handleClick = async () => {
    if (!selectedWalletConnectAccount) return

    setIsLoading(true)
    if (!client) {
      throw new Error("No client")
    }

    if (!session) {
      throw new Error("No session")
    }

    const accountsRequest = {
      id: 1,
      jsonrpc: "2.0",
      method: "kadena_getAccounts_v1",
      params: {
        accounts: [
          {
            account: selectedWalletConnectAccount,
            contracts: onlyForCoinContract ? ["coin"] : undefined // optional, when omitted the wallet returns all known fungible accounts
          }
        ]
      }
    }

    console.info(
      `Calling kadena_getAccounts_v1 for ${selectedWalletConnectAccount}`
    )

    const [chain, network] = selectedWalletConnectAccount.split(":")

    const response = await client?.request?.({
      topic: session.topic,
      chainId: `${chain}:${network}`,
      request: accountsRequest
    })

    setKadenaAccounts(response?.accounts)
    getBalances(response?.accounts, network)
    setIsLoading(false)
  }

  return (
    <div>
      <h3>Accounts</h3>
      <p>
        <select onChange={e => setSelectedWalletConnectAccount(e.target.value)}>
          {accounts?.map(account => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
        <br />
        <label>
          <input
            type="checkbox"
            checked={onlyForCoinContract}
            onChange={() => setOnlyForCoinContract(!onlyForCoinContract)}
          ></input>
          Get only for the coin contract
        </label>
      </p>

      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get accounts"}
      </button>

      {kadenaAccounts &&
        kadenaAccounts.map(account => {
          const [, network] = account.account.split(":")

          return (
            <div key={account.account}>
              <h4>{account.account}</h4>
              {account.kadenaAccounts.map(kadenaAccount => {
                return (
                  <Fragment key={kadenaAccount.name}>
                    <div>
                      <strong>Account:</strong> {kadenaAccount.name}
                    </div>
                    <div>
                      <strong>Contract:</strong> {kadenaAccount.contract}
                    </div>
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Chain</th>
                            <th>Balance</th>
                            <th></th>
                          </tr>
                        </thead>

                        <tbody>
                          {kadenaAccount.chains.map(chain => {
                            const isSelectedAccount =
                              selectedAccount?.account === kadenaAccount.name &&
                              selectedAccount?.chainId === chain
                            return (
                              <tr
                                key={chain}
                                style={
                                  isSelectedAccount
                                    ? { fontWeight: "bold" }
                                    : undefined
                                }
                              >
                                <td>{chain}</td>
                                <td>
                                  {
                                    balances.find(
                                      balanceItem => balanceItem.chain === chain
                                    )?.balance
                                  }
                                </td>
                                <td>
                                  {!isSelectedAccount && (
                                    <button
                                      onClick={() =>
                                        setSelectedAccount({
                                          network,
                                          account: kadenaAccount.name,
                                          chainId: chain
                                        })
                                      }
                                    >
                                      Select account and chain for transfer
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Fragment>
                )
              })}
            </div>
          )
        })}
    </div>
  )
}
