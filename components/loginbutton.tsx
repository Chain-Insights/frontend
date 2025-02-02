'use client';

import WalletWrapper from "./walletwrapper";

interface LoginButtonProps {
    onClick?: () => Promise<void>;
}

export default function LoginButton({ onClick }: LoginButtonProps) {
    return (
        <button onClick={onClick} className="min-w-[90px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold">
            Sign In
        </button>
    );
}
