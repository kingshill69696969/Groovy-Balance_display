import React, { useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import styles from './DisplayBalance.module.css';
import { Box, Flex, Heading, MetaMaskButton } from 'rimble-ui';
import {
  connectToMetamask,
  getERC20Balance,
  weiToEth,
} from '../../apis/blockchain';
import { Context as _web3Context } from '../../contexts/Web3Provider/Web3Provider';

const DisplayBalance = () => {
  let web3Context = useContext(_web3Context);

  const [state, setState] = useState({
    GVYBalance: BigNumber.from('0'),
  });

  const setupStates = async () => {
    try {
      const GVYBalance = await getERC20Balance(
        web3Context.web3.GVYToken,
        web3Context.currentAccountAddress
      );

      setState({ ...state, GVYBalance });
    } catch (error) {}
  };

  useEffect(() => {
    if (web3Context.web3.initialized === true) {
      setupStates();
    }
  }, [web3Context]);

  return (
    <Flex className={styles.root}>
      <Box>
        {web3Context.currentAccountAddress.length === 0 ? (
          <MetaMaskButton
            onClick={() => {
              connectToMetamask(web3Context.web3.metamaskProvider);
            }}
          >
            Connect with MetaMask
          </MetaMaskButton>
        ) : (
          <Heading>Your GVY balance is: {weiToEth(state.GVYBalance)}</Heading>
        )}
      </Box>
    </Flex>
  );
};

export default DisplayBalance;
