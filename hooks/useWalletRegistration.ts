import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export const useWalletRegistration = () => {
  const { address } = useAccount();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [smartWalletAddress, setSmartWalletAddress] = useState<`0x${string}` | null>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem(`smartWallet_${address}`);
    return stored ? (stored as `0x${string}`) : null;
  });

  // Update localStorage when smartWalletAddress changes
  useEffect(() => {
    if (address && smartWalletAddress) {
      localStorage.setItem(`smartWallet_${address}`, smartWalletAddress);
    }
  }, [address, smartWalletAddress]);

  const registerWallet = async () => {
    if (!address) {
      setError('No wallet address found');
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      const response = await fetch('https://api-test-production-9439.up.railway.app/api/register-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: address,
          wallet_address: address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register wallet');
      }

      const data = await response.json();
      if (data?.wallet_address) {
        const formattedAddress = data.wallet_address.startsWith('0x')
          ? data.wallet_address as `0x${string}`
          : `0x${data.wallet_address}` as `0x${string}`;
        setSmartWalletAddress(formattedAddress);
        localStorage.setItem(`smartWallet_${address}`, formattedAddress);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register wallet');
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  const getUserDetails = async () => {
    if (!address) {
      setError('No wallet address found');
      return null;
    }

    try {
      const response = await fetch(`https://api-test-production-9439.up.railway.app/api/wallet/${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      console.log("data user", data)
      // if (data?.wallet_address) {
      //   const formattedAddress = data.wallet_address.startsWith('0x')
      //     ? data.wallet_address as `0x${string}`
      //     : `0x${data.wallet_address}` as `0x${string}`;
      //   setSmartWalletAddress(formattedAddress);
      //   localStorage.setItem(`smartWallet_${address}`, formattedAddress);
      // }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      throw err;
    }
  };

  const clearSmartWalletAddress = () => {
    if (address) {
      localStorage.removeItem(`smartWallet_${address}`);
      setSmartWalletAddress(null);
    }
  };

  return {
    registerWallet,
    getUserDetails,
    isRegistering,
    error,
    smartWalletAddress,
    clearSmartWalletAddress,
  };
}; 