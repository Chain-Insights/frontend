import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { useWalletRegistration } from './useWalletRegistration';

export const useTokenTransfer = () => {
  const { address } = useAccount();
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userDetails, getUserDetails, registerWallet } = useWalletRegistration();

  const { sendTransaction } = useSendTransaction();

  useEffect(() => {
    const initializeUserDetails = async () => {
      if (address) {
        try {
          // First try to get user details
          await getUserDetails();
        } catch (error) {
          // If getting user details fails, try registering the wallet
          await registerWallet();
          // After successful registration, get user details
          await getUserDetails();
        }
      }
    };

    if (!userDetails && address) {
      initializeUserDetails().catch(console.error);
    }
  }, [address, userDetails, getUserDetails, registerWallet]);

  const handleTransferAndSwap = async (amount: string) => {
    if (!address) {
      setError('No wallet connected');
      return;
    }

    if (!userDetails) {
      setError('No user details available. Please try again.');
      return;
    }

    setIsTransferring(true);
    setError(null);

    try {
      const transferAmount = parseEther(amount);
      
      const hash = await sendTransaction({
        to: userDetails.wallet_address,
        value: transferAmount,
      });

      // Then call the batch-swap API
      const response = await fetch('https://api-test-production-9439.up.railway.app/api/batch-swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: address,
          amount: amount,
          transaction_hash: hash, // Include the transaction hash in the API call
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute batch swap');
      }

      const data = await response.json();
      console.log("token transfer", data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer and swap');
      throw err;
    } finally {
      setIsTransferring(false);
    }
  };

  return {
    handleTransferAndSwap,
    isTransferring,
    error,
    userDetails, // Also expose userDetails so components can check its status
  };
}; 