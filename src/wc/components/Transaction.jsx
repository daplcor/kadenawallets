// import { useWalletConnectClient } from "@/providers/ClientContextProvider"
// import { createWalletConnectSign } from "@/utils/signWithWalletConnect"
// import { useState } from "react"
// import { PactCommand } from "@kadena/client"
// import { onlyKey } from "@/utils/onlyKey"
// import { apiHost } from "@/utils/apiHost"
// import { createSendRequest, local, send } from "@kadena/chainweb-node-client"
// import { PactNumber } from "@kadena/pactjs"
// import { createWalletConnectQuicksign } from "@/utils/quicksignWithWalletConnect"

// export const Transaction = ({ selectedAccount, type }) => {
//   const { client, session } = useWalletConnectClient()

//   const [amount, setAmount] = useState(0)
//   const [toAccount, setToAccount] = useState()
//   const [transaction, setTransaction] = useState()
//   const [localResult, setLocalResult] = useState()
//   const [sendResult, setSendResult] = useState()

//   const buildAndSignTransaction = async () => {
//     if (!client) {
//       throw new Error("No client")
//     }

//     if (!session) {
//       throw new Error("No session")
//     }

//     if (!selectedAccount) {
//       throw new Error("No selected account to send from")
//     }

//     if (!toAccount) {
//       throw new Error("No account to send to set")
//     }

//     if (!amount) {
//       throw new Error("No amount set")
//     }

//     const signWithWalletConnect = createWalletConnectSign(client, session)
//     const quicksignWithWalletConnect = createWalletConnectQuicksign(
//       client,
//       session
//     )

//     const pactDecimal = { decimal: `${amount}` }

//     const pactCommand = new PactCommand()
//     pactCommand.code = `(coin.transfer "${
//       selectedAccount.account
//     }" "${toAccount}" ${new PactNumber(amount).toDecimal()})`

//     pactCommand
//       .setMeta(
//         {
//           chainId: selectedAccount.chainId,
//           gasLimit: 1000,
//           gasPrice: 1.0e-6,
//           ttl: 10 * 60,
//           sender: selectedAccount.account
//         },
//         selectedAccount.network
//       )
//       .addCap("coin.GAS", onlyKey(selectedAccount.account))
//       .addCap(
//         "coin.TRANSFER", // pubKey of sender
//         onlyKey(selectedAccount.account), // account of sender
//         selectedAccount.account, // account of receiver
//         toAccount, // amount
//         pactDecimal
//       )
//       .createCommand()

//     let signedPactCommands
//     if (type === "sign") {
//       signedPactCommands = await signWithWalletConnect(pactCommand)
//     }

//     if (type === "quicksign") {
//       signedPactCommands = await quicksignWithWalletConnect(pactCommand)
//     }

//     if (!signedPactCommands) {
//       throw new Error("No signed pact commands")
//     }

//     // In this example we only support one command, so we get the first one
//     setTransaction({
//       signedPactCommand: signedPactCommands[0],
//       chainId: pactCommand.publicMeta.chainId,
//       networkId: pactCommand.networkId
//     })

//     return {
//       signedPactCommand: signedPactCommands[0],
//       chainId: pactCommand.publicMeta.chainId,
//       networkId: pactCommand.networkId
//     }
//   }

//   const handleClickLocal = async () => {
//     const {
//       signedPactCommand,
//       chainId,
//       networkId
//     } = await buildAndSignTransaction()

//     const localResult = await local(
//       signedPactCommand,
//       apiHost(chainId, networkId)
//     )

//     setLocalResult(localResult)
//   }

//   const handleClickSend = async () => {
//     const { signedPactCommand, chainId, networkId } = transaction
//     const sendResult = await send(
//       createSendRequest(signedPactCommand),
//       apiHost(chainId, networkId)
//     )

//     setSendResult(sendResult)
//   }

//   return (
//     <>
//       {selectedAccount ? (
//         <>
//           <p>
//             <strong>Send from:</strong> {selectedAccount?.account}
//             <br />
//             <strong>Chain:</strong> {selectedAccount?.chainId}
//           </p>

//           <p>
//             <label>
//               <strong>Account to transfer to:</strong>
//               <input type="text" onChange={e => setToAccount(e.target.value)} />
//             </label>

//             <br />

//             <label>
//               <strong>Amount:</strong>{" "}
//               <input
//                 type="number"
//                 onChange={e => setAmount(parseFloat(e.target.value))}
//               />
//             </label>
//           </p>

//           <button onClick={handleClickLocal}>Validate transaction</button>

//           {localResult && (
//             <>
//               <h3>Local result</h3>
//               <pre>{JSON.stringify(localResult, null, 2)}</pre>
//               <button onClick={handleClickSend}>Send transaction</button>
//             </>
//           )}

//           {sendResult && (
//             <>
//               <h3>Send result</h3>
//               <pre>{JSON.stringify(sendResult, null, 2)}</pre>
//             </>
//           )}
//         </>
//       ) : (
//         <div>Select an account to send the transfer from</div>
//       )}
//     </>
//   )
// }
