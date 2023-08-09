import React, { useEffect, useRef } from "react";
import { X_WALLET, ZELCORE, WC } from "../providers/providers";
import { connectWithProvider } from "../store/kadenaSlice";
import kadenaStore, {accountStore} from "../store/kadenaSlice";
import walletConnectStore from "../store/connectWalletModalSlice";
import "./wallet.css"; 
import { useWalletConnect } from "../store/wcStore"; 
import {Ecko, Zelcore, WalletConnect} from '../../../assets';


function ConnectWalletModal(props) {
  const { handleConnect } = useWalletConnect();
  

  const showModal = walletConnectStore((state) => state.showModal);
  const provider = kadenaStore((state) => state.provider);
  const newMessage = kadenaStore((state) => state.newMessage);
  const newTransaction = kadenaStore((state) => state.newTransaction);

  const modalRef = useRef(); // Create a ref for the modal

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  }


  const closeModal =  walletConnectStore((state) => state.sethideConnectWalletModal);


  const connectXWalletClicked = connectWithProvider(X_WALLET);
  const connectZelcoreClicked = connectWithProvider(ZELCORE);
  const connectWCClicked = connectWithProvider(WC);
  const handleWalletConnect = async () => {
     handleConnect();
     connectWithProvider(WC)
  };

  // Add event listener when component mounts
  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]); // Add showModal to dependency array to update listener when it changes


  useEffect(() => {
    if (props.onNewTransaction) {
      props.onNewTransaction(newTransaction);
    }
  }, [newTransaction]);

  useEffect(() => {
    if (props.onNewMessage) {
      props.onNewMessage(newMessage);
    }
  }, [newMessage]);

  useEffect(() => {
    if (props.onWalletConnected) {
      props.onWalletConnected(provider);
    }
  }, [provider]);
// console.log("provider", provider);
  if (!showModal) {
    return null;
  }

 
return (
  <div className="modal" ref={modalRef} >
    <div className="modal-container">
      <div className="modal-header">
        <span>Connect Wallet</span>
        
      </div>
      <button className="modal-button" onClick={connectXWalletClicked}>
       <Ecko className="svglogos" /> Ecko Wallet 
      </button>
      <button className="modal-button" onClick={connectZelcoreClicked}>
      <Zelcore className="svglogos" />  Zelcore
      </button>
      <button className="modal-button" onClick={handleWalletConnect}>
     <WalletConnect className="svglogos" /> Wallet Connect
      </button>
      </div>
  </div>
);
}
export default ConnectWalletModal;