import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Percent, TrendingUp, Lock } from 'lucide-react';

const INVESTMENT_BUCKETS = {
    memecoin: {
        name: "Memecoin Bucket",
        description: "A collection of popular meme-driven cryptocurrencies for aggressive investors",
        icon: TrendingUp,
        expectedReturn: "High potential returns with high risk",
        coins: [
            {
                name: "Dogecoin",
                symbol: "DOGE",
                allocation: 25,
                analysis: "Community-driven cryptocurrency with strong social media presence"
            },
            {
                name: "Shiba Inu",
                symbol: "SHIB",
                allocation: 20,
                analysis: "Popular memecoin with growing ecosystem"
            },
            {
                name: "Pepe",
                symbol: "PEPE",
                allocation: 20,
                analysis: "Emerging memecoin based on popular internet meme"
            },
            {
                name: "Floki Inu",
                symbol: "FLOKI",
                allocation: 20,
                analysis: "Community-focused memecoin with marketing emphasis"
            },
            {
                name: "Baby Doge",
                symbol: "BABYDOGE",
                allocation: 15,
                analysis: "Deflationary token with automatic rewards"
            }
        ]
    },
    defi: {
        name: "DeFi Bucket",
        description: "Balanced portfolio of decentralized finance protocols",
        icon: Percent,
        expectedReturn: "Moderate returns with yield opportunities",
        coins: [
            {
                name: "Uniswap",
                symbol: "UNI",
                allocation: 25,
                analysis: "Leading DEX with proven track record"
            },
            {
                name: "Aave",
                symbol: "AAVE",
                allocation: 25,
                analysis: "Major lending protocol with multi-chain presence"
            },
            {
                name: "Compound",
                symbol: "COMP",
                allocation: 20,
                analysis: "Established lending platform with governance token"
            },
            {
                name: "MakerDAO",
                symbol: "MKR",
                allocation: 15,
                analysis: "Pioneering DeFi protocol managing DAI stablecoin"
            },
            {
                name: "Curve",
                symbol: "CRV",
                allocation: 15,
                analysis: "Efficient stablecoin exchange protocol"
            }
        ]
    },
    safe: {
        name: "Blue-Chip Bucket",
        // description: "Stable portfolio of established cryptocurrencies",
        icon: Lock,
        // expectedReturn: "Lower but stable expected returns",
        coins: [
            {
                name: "Bitcoin",
                symbol: "BTC",
                allocation: 40,
                analysis: "Market leading cryptocurrency with institutional adoption"
            },
            {
                name: "Ethereum",
                symbol: "ETH",
                allocation: 30,
                analysis: "Leading smart contract platform"
            },
            {
                name: "Cardano",
                symbol: "ADA",
                allocation: 10,
                analysis: "Research-driven blockchain platform"
            },
            {
                name: "Polkadot",
                symbol: "DOT",
                allocation: 10,
                analysis: "Interoperability focused blockchain network"
            },
            {
                name: "Chainlink",
                symbol: "LINK",
                allocation: 10,
                analysis: "Essential oracle network for smart contracts"
            }
        ]
    }
};

interface BucketCardProps {
    bucket: typeof INVESTMENT_BUCKETS[keyof typeof INVESTMENT_BUCKETS];
    type: keyof typeof INVESTMENT_BUCKETS;
    isSelected: boolean;
    onSelect: (type: keyof typeof INVESTMENT_BUCKETS) => void;
    expanded: boolean;
    onToggleExpand: (type: keyof typeof INVESTMENT_BUCKETS) => void;
}

const BucketCard: React.FC<BucketCardProps> = ({ bucket, type, isSelected, onSelect, expanded, onToggleExpand }) => {
    const Icon = bucket.icon;

    return (
        <Card className={`transition-all duration-300 ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
            }`}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon className="w-6 h-6" />
                    {bucket.name}
                </CardTitle>
                {/* <p className="text-sm text-gray-500">{bucket.description}</p> */}
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    {/* <p className="font-medium">Expected Return: {bucket.expectedReturn}</p> */}
                    <Button
                        onClick={() => onSelect(type)}
                        variant={isSelected ? "default" : "outline"}
                        className="w-full"
                    >
                        {isSelected ? "Selected" : "Select Bucket"}
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{bucket.coins.length} coins included</p>
                <Button variant="ghost" onClick={() => onToggleExpand(type)}>
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
            </CardFooter>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                    >
                        <div className="space-y-4">
                            {bucket.coins.map((coin) => (
                                <div key={coin.symbol} className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium">{coin.name} ({coin.symbol})</h4>
                                            <p className="text-sm text-gray-500">{coin.analysis}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold">{coin.allocation}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};

const BucketSelection = ({ onBucketSelect }: { onBucketSelect: (bucket: typeof INVESTMENT_BUCKETS[keyof typeof INVESTMENT_BUCKETS]) => void }) => {
    const [selectedBucket, setSelectedBucket] = useState<keyof typeof INVESTMENT_BUCKETS | null>(null);
    const [expandedBucket, setExpandedBucket] = useState<keyof typeof INVESTMENT_BUCKETS | null>(null);

    const handleBucketSelect = (bucketType: keyof typeof INVESTMENT_BUCKETS): void => {
        setSelectedBucket(bucketType);
        onBucketSelect(INVESTMENT_BUCKETS[bucketType]);
    };

    const handleToggleExpand = (bucketType: keyof typeof INVESTMENT_BUCKETS) => {
        setExpandedBucket(expandedBucket === bucketType ? null : bucketType);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Select Your Investment Bucket</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(INVESTMENT_BUCKETS).map(([type, bucket]) => (
                    <BucketCard
                        key={type}
                        type={type as keyof typeof INVESTMENT_BUCKETS}
                        bucket={bucket}
                        isSelected={selectedBucket === type}
                        onSelect={handleBucketSelect}
                        expanded={expandedBucket === type}
                        onToggleExpand={handleToggleExpand}
                    />
                ))}
            </div>
        </div>
    );
};

export default BucketSelection;