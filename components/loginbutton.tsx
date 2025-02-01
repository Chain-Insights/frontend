'use client';

import WalletWrapper from "./walletwrapper";


export default function LoginButton() {
    return (
        <WalletWrapper
            className="min-w-[90px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
            text="Log in"
            withWalletAggregator={true}
        />
    );
}
