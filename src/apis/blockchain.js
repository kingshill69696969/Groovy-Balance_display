import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import IERC20Abi from '../abis/IERC20.json';
import { GVY_TOKEN } from '../constants/addresses';

export const getWeb3Provider = (provider) => {
  if (provider) {
    return new ethers.providers.Web3Provider(provider);
  } else {
    return null;
  }
};

export const getMetamaskProvider = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    return provider;
  } else {
    return null;
  }
};

export const isMetamaskConnected = async (provider) => {
  return provider.isConnected();
};

export const addMetamaskListeners = (
  provider,
  chainChangedCallback,
  messageCallback,
  accountsChangedCallback
) => {
  provider.on('chainChanged', (chainId) => {
    chainChangedCallback(chainId);
  });
  provider.on('message', (message) => {
    messageCallback(message);
  });
  provider.on('accountsChanged', (accounts) => {
    accountsChangedCallback(accounts);
  });
};

export const getAccountSigner = async (web3Provider) => {
  return await web3Provider.getSigner();
};

export const weiToEth = (weiBalance) => {
  return ethers.utils.formatEther(weiBalance);
};

export const ethToWei = (ethBalance) => {
  return ethers.utils.parseEther(ethBalance);
};

export const formatUnits = (weiBalance, decimals) => {
  return ethers.utils.formatUnits(weiBalance, decimals);
};

export const connectToMetamask = (web3Provider) => {
  web3Provider.request({ method: 'eth_requestAccounts' });
};

export const getGVYTokenContract = async (web3Provider) => {
  const GVYTokenContract = new ethers.Contract(
    GVY_TOKEN,
    IERC20Abi,
    await web3Provider.getSigner()
  );

  return GVYTokenContract;
};

export const getERC20Balance = async (tokenContract, accountAddress) => {
  return await tokenContract.balanceOf(accountAddress);
};
