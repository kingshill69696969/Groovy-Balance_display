import React, { createContext, useEffect, useState } from 'react';

import {
  getWeb3Provider,
  getMetamaskProvider,
  isMetamaskConnected,
  addMetamaskListeners,
  getAccountSigner,
  getGVYTokenContract,
} from '../../apis/blockchain';

export const Context = createContext();

const Web3Provider = ({ children }) => {
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [currentAccountAddress, setCurrentAccountAddress] = useState('');
  const [web3, setWeb3] = useState({
    initialized: false,

    metamaskProvider: null,
    web3Provider: null,
    metamaskInstalled: true,

    networkId: 1,

    GVYToken: null,
  });

  const web3Setup = async () => {
    try {
      let metamaskProvider = await getMetamaskProvider();
      let web3Provider = await getWeb3Provider(metamaskProvider);

      if (metamaskProvider && web3Provider) {
        addMetamaskListeners(
          metamaskProvider,
          async (chainId) => {
            setWeb3({
              ...web3,
              networkId: parseInt(chainId),
            });
          },
          (message) => {},
          async (accounts) => {
            if (accounts.length === 0) {
              setMetamaskConnected(false);
              setCurrentAccountAddress('');
            } else if (accounts[0] !== currentAccountAddress) {
              setCurrentAccountAddress(accounts[0]);
              setMetamaskConnected(true);
            }
          }
        );

        let currentAccountAddress;
        try {
          currentAccountAddress = await (
            await getAccountSigner(web3Provider)
          ).getAddress();
        } catch (error) {
          currentAccountAddress = '';
        }

        setCurrentAccountAddress(currentAccountAddress);
        setMetamaskConnected(await isMetamaskConnected(metamaskProvider));
        setWeb3({
          ...web3,
          initialized: true,
          web3Provider,
          metamaskProvider,
          networkId: parseInt(window.ethereum.chainId),
          GVYToken: await getGVYTokenContract(web3Provider),
        });
      } else {
        setMetamaskConnected(false);
        setWeb3({
          ...web3,
          metamaskInstalled: false,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    web3Setup();
  }, []);

  return (
    <Context.Provider
      value={{ web3, currentAccountAddress, metamaskConnected }}
    >
      {children}
    </Context.Provider>
  );
};

export default Web3Provider;
