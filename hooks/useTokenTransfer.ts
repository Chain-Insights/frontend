import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { useWalletRegistration } from './useWalletRegistration';

export const useTokenTransfer = () => {
  const { address } = useAccount();
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { smartWalletAddress, getUserDetails } = useWalletRegistration();

  const { sendTransaction } = useSendTransaction();

  // Get smart wallet address from localStorage if not available in state
  const getStoredSmartWalletAddress = (): `0x${string}` | null => {
    if (smartWalletAddress) return smartWalletAddress;
    if (!address) return null;
    
    const stored = localStorage.getItem(`smartWallet_${address}`);
    return stored ? (stored as `0x${string}`) : null;
  };

  const handleTransferAndSwap = async (amount: string) => {
    if (!address) {
      setError('No wallet connected');
      return;
    }

    const targetWalletAddress = getStoredSmartWalletAddress();
    if (!targetWalletAddress) {
      setError('Smart wallet address not found. Please try again.');
      // Try to get user details to refresh the smart wallet address
      try {
        await getUserDetails();
      } catch (error) {
        console.error("Failed to get user details:", error);
      }
      return;
    }

    setIsTransferring(true);
    setError(null);

    try {
      const transferAmount = parseEther(amount);
      
      const hash = await sendTransaction({
        to: targetWalletAddress,
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
          transaction_hash: hash,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute batch swap');
      }

      const data = await response.json();
      console.log("Token transfer successful:", data);
      return data;
    } catch (err) {
      console.error("Transfer failed:", err);
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
    smartWalletAddress: getStoredSmartWalletAddress(),
  };
}; 