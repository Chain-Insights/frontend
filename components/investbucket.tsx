import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Types
interface BasketCoin {
    name: string;
    symbol: string;
    analysis: {
        marketAnalysis: string;
        riskProfileMatch: string;
        investmentHorizonFit: string;
        experienceLevelMatch: string;
    };
}

interface InvestmentBasketsProps {
    selectedCoin: string | null;
    onCoinSelect: (name: string) => void;
    data: {
        memecoinBasket: BasketCoin[];
        defiBasket: BasketCoin[];
        safeInvestingBasket: BasketCoin[];
    };
}

const CoinCard = memo(({
    coin,
    selectedCoin,
    expandedCoin,
    onCoinSelect,
    onExpandToggle
}: {
    coin: BasketCoin;
    selectedCoin: string | null;
    expandedCoin: string | null;
    onCoinSelect: (name: string) => void;
    onExpandToggle: (name: string) => void;
}) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>{coin.name}</span>
                <span className="text-sm text-gray-500">{coin.symbol}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm mb-2">{coin.analysis.marketAnalysis}</p>
            <p className="text-sm text-gray-600">{coin.analysis.riskProfileMatch}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button
                onClick={() => onCoinSelect(coin.name)}
                variant={selectedCoin === coin.name ? "default" : "outline"}
                className="w-32"
            >
                {selectedCoin === coin.name ? "Selected" : "Select"}
            </Button>
            <Button
                variant="ghost"
                onClick={() => onExpandToggle(coin.name)}
                className="ml-2"
            >
                {expandedCoin === coin.name ? <ChevronUp /> : <ChevronDown />}
            </Button>
        </CardFooter>
        <AnimatePresence>
            {expandedCoin === coin.name && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4"
                >
                    <div className="space-y-2 text-sm">
                        <p><strong>Investment Horizon:</strong> {coin.analysis.investmentHorizonFit}</p>
                        <p><strong>Experience Level:</strong> {coin.analysis.experienceLevelMatch}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </Card>
));

CoinCard.displayName = 'CoinCard';

const BasketSection = memo(({
    title,
    coins,
    selectedCoin,
    expandedCoin,
    onCoinSelect,
    onExpandToggle
}: {
    title: string;
    coins: BasketCoin[];
    selectedCoin: string | null;
    expandedCoin: string | null;
    onCoinSelect: (name: string) => void;
    onExpandToggle: (name: string) => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
    >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins.map((coin, index) => (
                <motion.div
                    key={coin.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <CoinCard
                        coin={coin}
                        selectedCoin={selectedCoin}
                        expandedCoin={expandedCoin}
                        onCoinSelect={onCoinSelect}
                        onExpandToggle={onExpandToggle}
                    />
                </motion.div>
            ))}
        </div>
    </motion.div>
));

BasketSection.displayName = 'BasketSection';

const InvestmentBaskets = ({ selectedCoin, onCoinSelect, data }: InvestmentBasketsProps) => {
    const [expandedCoin, setExpandedCoin] = useState<string | null>(null);

    const handleExpandToggle = (coinName: string) => {
        setExpandedCoin(prev => prev === coinName ? null : coinName);
    };

    return (
        <div className="space-y-8">
            <BasketSection
                title="Safe Investment Options"
                coins={data.safeInvestingBasket}
                selectedCoin={selectedCoin}
                expandedCoin={expandedCoin}
                onCoinSelect={onCoinSelect}
                onExpandToggle={handleExpandToggle}
            />

            <BasketSection
                title="DeFi Investment Options"
                coins={data.defiBasket}
                selectedCoin={selectedCoin}
                expandedCoin={expandedCoin}
                onCoinSelect={onCoinSelect}
                onExpandToggle={handleExpandToggle}
            />

            <BasketSection
                title="Memecoin Investment Options"
                coins={data.memecoinBasket}
                selectedCoin={selectedCoin}
                expandedCoin={expandedCoin}
                onCoinSelect={onCoinSelect}
                onExpandToggle={handleExpandToggle}
            />
        </div>
    );
};

export default InvestmentBaskets;