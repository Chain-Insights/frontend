import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Address } from "@coinbase/onchainkit/identity"
import { useAccount } from "wagmi"

// Types and Interfaces
interface BaseBasketProps {
  onSubmit: (answers: string[], selectedCoin: string, funds: number) => void
}

interface Question {
  text: string
  options: string[]
}

interface Coin {
  name: string
  value: number
  percentage: number
  additionalInfo: string
}
const slideAnimation = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 50, opacity: 0 },
  transition: { type: "spring", stiffness: 100, damping: 15 }
}


const fadeAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

// Constants remain the same
const QUESTIONS: Question[] = [
  {
    text: "How would you describe your risk tolerance?",
    options: [
      "Conservative: Prefer minimal risk and steady returns.",
      "Balanced: Comfortable with moderate risk for potentially higher returns.",
      "Aggressive: Willing to accept higher volatility for the chance of significant gains."
    ]
  },
  {
    text: "What is your expected investment horizon?",
    options: [
      "Short-Term: Less than 1 year.",
      "Medium-Term: 1 to 5 years.",
      "Long-Term: Over 5 years."
    ]
  },
  {
    text: "What is your Trading experience?",
    options: [
      "Beginner: Little or no experience, looking for guided strategies.",
      "Intermediate: Some trading knowledge and moderate hands-on experience.",
      "Advanced: Extensive experience and comfortable with complex strategies."
    ]
  }
]

const COINS: Coin[] = [
  {
    name: "Bitcoin",
    value: 45000,
    percentage: 50,
    additionalInfo: "The world's first and most popular cryptocurrency."
  },
  {
    name: "Ethereum",
    value: 3000,
    percentage: 30,
    additionalInfo: "A decentralized platform that runs smart contracts."
  },
  {
    name: "Cardano",
    value: 1.5,
    percentage: 20,
    additionalInfo: "A proof-of-stake blockchain platform."
  }
]

// Memoized Option Button Component
const OptionButton = memo(({
  option,
  isSelected,
  onClick
}: {
  option: string
  isSelected: boolean
  onClick: () => void
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isSelected ? "default" : "outline"}
          onClick={onClick}
          className="w-12 h-12 text-lg font-bold"
        >
          {option[0]}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{option}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
))

OptionButton.displayName = 'OptionButton'

// Memoized Question Component
const QuestionItem = memo(({
  question,
  index,
  selectedAnswer,
  onAnswerSelect
}: {
  question: Question
  index: number
  selectedAnswer: string
  onAnswerSelect: (index: number, value: string) => void
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    className="bg-gray-50 p-6 rounded-lg"
  >
    <h2 className="text-2xl font-bold mb-4 text-primary">
      {question.text}
    </h2>
    <div className="flex flex-wrap gap-2">
      {question.options.map((option, optionIndex) => (
        <OptionButton
          key={optionIndex}
          option={option}
          isSelected={selectedAnswer === option}
          onClick={() => onAnswerSelect(index, option)}
        />
      ))}
    </div>
  </motion.div>
))

QuestionItem.displayName = 'QuestionItem'

const CoinCard = memo(({
  coin,
  selectedCoin,
  expandedCoin,
  onCoinSelect,
  onExpandToggle
}: {
  coin: Coin
  selectedCoin: string | null
  expandedCoin: string | null
  onCoinSelect: (name: string) => void
  onExpandToggle: (name: string) => void
}) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle>{coin.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Current Value: ${coin.value.toLocaleString()}</p>
      <p>Investment: {coin.percentage}%</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button
        onClick={() => onCoinSelect(coin.name)}
        variant={selectedCoin === coin.name ? "default" : "outline"}
      >
        {selectedCoin === coin.name ? "Selected" : "Select"}
      </Button>
      <Button
        variant="ghost"
        onClick={() => onExpandToggle(coin.name)}
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
          <p>{coin.additionalInfo}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </Card>
))

CoinCard.displayName = 'CoinCard'

export default function BaseBasket({ onSubmit }: BaseBasketProps) {
  const { address } = useAccount()
  const [dynamicCoins, setDynamicCoins] = useState<Coin[]>(COINS);
  const [isLoading, setIsLoading] = useState(false);


  // State
  const [answers, setAnswers] = useState<string[]>(new Array(QUESTIONS.length).fill(""))
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [expandedCoin, setExpandedCoin] = useState<string | null>(null)
  const [funds, setFunds] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showQuestions, setShowQuestions] = useState(true)

  // Handlers
  const handleAnswerChange = useCallback((index: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }, [])

  const handleCoinSelect = useCallback((coinName: string) => {
    setSelectedCoin(coinName)
  }, [])

  const handleExpandToggle = useCallback((coinName: string) => {
    setExpandedCoin(prev => prev === coinName ? null : coinName)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (selectedCoin && funds) {
      setIsSubmitting(true)
      await onSubmit(answers, selectedCoin, Number.parseFloat(funds))
      setIsSubmitting(false)
    }
  }, [answers, selectedCoin, funds, onSubmit])

  const postAnswerAndGetBucketList = useCallback(async () => {
    console.log("Posting answers:", answers)
    setIsLoading(true);
    //create a post api to send the ans and get bucket list in the response
    try {
      const response = await fetch('http://localhost:8080/api/v1/ans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: address,
          ans_of_q1: answers[0],
          ans_of_q2: answers[1],
          ans_of_q3: answers[2]
        })
      });


      if (!response.ok) {
        throw new Error('Failed to fetch bucket list');
      }

      const data = await response.json();
      console.log("Data:", data);
      const bucketList = data.data || [];  // Assuming the array is in data property
      console.log("Bucket List:", bucketList);

      const formattedCoins: Coin[] = bucketList.map((coin: any) => ({
        name: coin.name,
        value: coin.current_price,
        percentage: coin.allocation_percentage,
        additionalInfo: coin.description || `${coin.name} investment option`
      }));

      setDynamicCoins(formattedCoins);
      setShowQuestions(false)
      setIsLoading(false);
      return bucketList;
    } catch (error) {
      console.error('Error fetching bucket list:', error);

      setIsLoading(false);
      throw error;
    }


  }, [answers])

  const handleBack = useCallback(() => {
    setShowQuestions(true)
    setSelectedCoin(null)
    setFunds("")
  }, [])

  const allQuestionsAnswered = answers.every(answer => answer !== "")

  const progress = allQuestionsAnswered
    ? selectedCoin
      ? funds
        ? 100
        : 90
      : 75
    : (answers.filter(a => a !== "").length / QUESTIONS.length) * 75

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Progress value={progress} className="mb-8" />

      <AnimatePresence mode="wait">
        {showQuestions ? (isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) :
          <motion.div
            key="questions"
            {...fadeAnimation}
            className="space-y-8"
          >
            {QUESTIONS.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                index={index}
                selectedAnswer={answers[index]}
                onAnswerSelect={handleAnswerChange}
              />
            ))}
            {allQuestionsAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <Button
                  onClick={() => postAnswerAndGetBucketList()}

                  className="px-8 py-4 text-lg"
                >
                  Continue to Investment
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="investment"
            {...fadeAnimation}
            className="space-y-8"
          >
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Questions
              </Button>
            </div>

            <div className="mb-8">
              <motion.h2
                className="text-2xl font-bold mb-4 text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Select a Coin
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dynamicCoins.map((coin, index) => (
                  <motion.div
                    key={coin.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CoinCard
                      coin={coin}
                      selectedCoin={selectedCoin}
                      expandedCoin={expandedCoin}
                      onCoinSelect={handleCoinSelect}
                      onExpandToggle={handleExpandToggle}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {selectedCoin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <motion.h2
                    className="text-2xl font-bold mb-4 text-primary"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Define Your Investment
                  </motion.h2>
                  <div className="mb-6">
                    <Label htmlFor="funds" className="text-lg mb-2 block">
                      How much do you want to invest in {selectedCoin}?
                    </Label>
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Input
                        id="funds"
                        type="number"
                        value={funds}
                        onChange={(e) => setFunds(e.target.value)}
                        className="text-2xl p-4"
                        placeholder="Enter amount"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={!funds || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Investment"}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}