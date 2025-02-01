'use client'
import React, { useState } from 'react'
// import LoginButton from './LoginButton'
// import SignupButton from './SignupButton'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import Image from 'next/image'
import LoginButton from './loginbutton'
import SignupButton from './signupbutton'
const Navbar = () => {
    const { address } = useAccount()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div>
            <nav className="w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 rounded-3xl">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <div className="flex flex-row items-center align-middle justify-center gap-2">
                                    {/* <Image src="/logo.png" alt="Resolutions" width={30} height={30} className="pb-1" /> */}
                                    <h1 className="text-2xl font-bold text-black">Resolutions</h1>
                                </div>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>

                        {/* Desktop navigation */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/create-resolution">
                                <button className="text-indigo-600 text-sm font-semibold hover:underline">Create Resolution</button>
                            </Link>
                            <Link href="/dashboard">
                                <button className="text-indigo-600 text-sm font-semibold hover:underline">Dashboard</button>
                            </Link>
                            {/* <div>
                                <button className="block w-full text-left py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50">
                                    Social
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        Coming Soon
                                    </span>
                                </button>
                            </div> */}
                            <SignupButton />
                            <div className="block md:hidden m-4" />
                            {!address && <LoginButton />}
                        </div>
                    </div>

                    {/* Mobile navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 space-y-2">
                            {/* <Link href="/create-resolution">
                                <button className="block w-full text-left px-4 py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50">Create Resolution</button>
                            </Link> */}

                            {/* <Link href="/dashboard">
                                <button className="block w-full text-left px-4 py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50">Dashboard</button>
                            </Link> */}
                            {/* <div>
                                <button className="block w-full text-left px-4 py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50">
                                    Social
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        Coming Soon
                                    </span>
                                </button>
                            </div> */}

                            <div className="flex flex-row items-center gap-4">
                                <SignupButton />
                                {!address && <LoginButton />}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default Navbar