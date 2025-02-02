import { NextResponse } from "next/server"

export async function GET() {
  // This is mock data. In a real application, you would fetch this from a cryptocurrency API
  const coins = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      price: 50000,
      marketCap: 1000000000000,
      volume24h: 50000000000,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      price: 3000,
      marketCap: 400000000000,
      volume24h: 20000000000,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      logo: "https://cryptologos.cc/logos/cardano-ada-logo.png",
      price: 1.5,
      marketCap: 50000000000,
      volume24h: 2000000000,
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
      price: 30,
      marketCap: 30000000000,
      volume24h: 1500000000,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
      price: 150,
      marketCap: 45000000000,
      volume24h: 3000000000,
    },
  ]

  return NextResponse.json(coins)
}

