import { useState } from 'react';
import { useAccount } from 'wagmi';

export const useWalletRegistration = () => {
  const { address } = useAccount();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

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
          user_id: address, // Using wallet address as user_id for simplicity
          wallet_address: address,
        }),
      });

      console.log("response", response)

      if (!response.ok) {
        throw new Error('Failed to register wallet');
      }

      const data = await response.json();
      console.log("post register data", data)
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

    setIsLoading(true);
    setError(null);

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
      console.log("get user details", data)
      setUserDetails(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerWallet,
    getUserDetails,
    isRegistering,
    isLoading,
    error,
    userDetails,
  };
}; 