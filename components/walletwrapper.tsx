'use client';
import {
    Address,
    Avatar,
    EthBalance,
    Identity,
    Name,
} from '@coinbase/onchainkit/identity';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownBasename,
    WalletDropdownDisconnect,
    WalletDropdownFundLink,
    WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWalletRegistration } from '@/hooks/useWalletRegistration';

type WalletWrapperParams = {
    text?: string;
    className?: string;
    withWalletAggregator?: boolean;
    icon?: React.ReactNode;
};

export default function WalletWrapper({
    className,
    text,
    withWalletAggregator = false,
}: WalletWrapperParams) {
    const { address, isConnected } = useAccount();
    const { registerWallet, getUserDetails, isRegistering, error } = useWalletRegistration();

    useEffect(() => {
        const initializeWallet = async () => {
            if (isConnected && address) {
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

        initializeWallet().catch(console.error);
    }, [isConnected, address]);

    return (
        <>
            <Wallet>
                <ConnectWallet
                    // withWalletAggregator={withWalletAggregator}
                    text={text}
                    className={className}
                >
                    <Avatar className="h-6 w-6" />
                    <Name />
                </ConnectWallet>
                <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
                        <Avatar />
                        <Name />
                        <Address />
                        <EthBalance />
                        {/* {userDetails && (
                            <div className="mt-2 text-sm text-gray-600">
                                Registered: ✓
                            </div>
                        )} */}
                    </Identity>
                    <WalletDropdownBasename />
                    <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                        Go to Wallet Dashboard
                    </WalletDropdownLink>
                    <WalletDropdownFundLink />
                    <WalletDropdownDisconnect />
                </WalletDropdown>
            </Wallet>
        </>
    );
}
