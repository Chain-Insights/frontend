import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CardSelectionProps {
  onSelectCard: (card: "baseBasket" | "smartTrading") => void
}

export default function CardSelection({ onSelectCard }: CardSelectionProps) {
  const [selectedCard, setSelectedCard] = useState<"baseBasket" | "smartTrading">("baseBasket")

  const handleCardClick = (card: "baseBasket" | "smartTrading") => {
    setSelectedCard(card)
    onSelectCard(card)
  }

  return (
    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 my-8">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Card
          className={`w-full md:w-64 cursor-pointer transition-all duration-300 ${
            selectedCard === "baseBasket" ? "border-primary border-2 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => handleCardClick("baseBasket")}
        >
          <CardHeader>
            <CardTitle className="text-center">Base Basket</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-gray-600 mb-4">Start with a pre-configured investment strategy</p>
            {selectedCard === "smartTrading" && (
              <Button onClick={() => handleCardClick("baseBasket")} variant="outline" className="w-full">
                Go Back
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Card
          className={`w-full md:w-64 cursor-pointer transition-all duration-300 ${
            selectedCard === "smartTrading" ? "border-primary border-2 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => handleCardClick("smartTrading")}
        >
          <CardHeader>
            <CardTitle className="text-center">Smart Trading Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-gray-600">Advanced AI-powered trading strategies</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

