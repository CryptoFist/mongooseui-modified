import React, { useEffect, useState } from 'react';
import "./header.component.scss";

import { metaMaskProvider } from '../../utils/wallet';


const Header = (props: any) => {
  const [walletAddress, setWalletAddress] = useState("Connect");
  const {showErrorMessage, showSuccessMessage} = props;

  const metamaskDetect = () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        return true;
      }
    } catch(e) {
      console.log(e);
    }
    return false;
  }

  useEffect(() => {
    const metamaskInstalled = metamaskDetect();
    if (metamaskInstalled === true) {
      connectWallet();
      window.ethereum.on("accountsChanged", (accounts: any) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setWalletAddress("Connect");
        }
      });
    } else {
      showErrorMessage("Please install metamask");
    }
    
  }, []);

  const connectWallet = async () => {
    try {
      await metaMaskProvider.connect();
      const curAddress = await metaMaskProvider.currentUser();
      if (curAddress !== undefined) {
        setWalletAddress(curAddress);
      } else {
        setWalletAddress("Connect");
      }
    } catch(e) {
      console.log(e);
    }
  }
  return (
    <header className="div-header">
      <div className="div-connection">
        <button className="btn-connect" onClick={() => connectWallet()}>{walletAddress}</button>
      </div>
    </header>
  );
}

export default Header;