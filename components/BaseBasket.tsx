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
import { ArrowLeft } from "lucide-react"
import { useAccount } from "wagmi"
import { useTokenTransfer } from "@/hooks/useTokenTransfer"
import BucketSelection from "./bucketCard"
// import BucketSelection from './BucketSelection'  // Import the new component

// Types and Interfaces
interface BaseBasketProps {
  onSubmit: (answers: string[], selectedBucket: string, funds: number) => void
}

interface Question {
  text: string
  options: string[]
}

const QUESTIONS: Question[] = [
  {
    text: "How would you describe your risk tolerance?",
    options: [
      "Conservative",
      "Balanced",
      "Aggressive"
    ]
  },
  {
    text: "What is your expected investment horizon?",
    options: [
      "Short-Term",
      "Medium-Term",
      "Long-Term"
    ]
  },
  {
    text: "What is your Trading experience?",
    options: [
      "Beginner",
      "Intermediate",
      "Advanced"
    ]
  }
]


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
        <Button
          key={optionIndex}
          variant={selectedAnswer === option ? "default" : "outline"}
          onClick={() => onAnswerSelect(index, option)}
          className="text-left"
        >
          {option}
        </Button>
      ))}
    </div>
  </motion.div>
))

QuestionItem.displayName = 'QuestionItem'

export default function BaseBasket({ onSubmit }: BaseBasketProps) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { handleTransferAndSwap, isTransferring, error: transferError, smartWalletAddress } = useTokenTransfer()

  // State
  const [answers, setAnswers] = useState<string[]>(new Array(QUESTIONS.length).fill(""))
  const [selectedBucket, setSelectedBucket] = useState<any>(null)
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

  const handleBucketSelect = useCallback((bucket: any) => {
    setSelectedBucket(bucket)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (selectedBucket && funds) {
      setIsSubmitting(true)
      try {
        // First handle the token transfer and batch swap
        await handleTransferAndSwap(funds)

        // Then call the original onSubmit
        await onSubmit(answers, selectedBucket.name, Number.parseFloat(funds))
      } catch (error) {
        console.error('Error during submission:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [answers, selectedBucket, funds, onSubmit, handleTransferAndSwap])

  const continueToInvestment = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setShowQuestions(false)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleBack = useCallback(() => {
    setShowQuestions(true)
    setSelectedBucket(null)
    setFunds("")
  }, [])

  const allQuestionsAnswered = answers.every(answer => answer !== "")

  const progress = allQuestionsAnswered
    ? selectedBucket
      ? funds
        ? 100
        : 90
      : 75
    : (answers.filter(a => a !== "").length / QUESTIONS.length) * 75

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Progress value={progress} className="mb-8" />

      <AnimatePresence mode="wait">
        {showQuestions ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
                  onClick={continueToInvestment}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h2 className="text-2xl font-bold">Investment Details</h2>
            </div>

            <BucketSelection onBucketSelect={handleBucketSelect} />

            {selectedBucket && (
              <div className="mt-6">
                <Label htmlFor="funds">Investment Amount</Label>
                <div className="mt-2">
                  <Input
                    id="funds"
                    type="number"
                    value={funds}
                    onChange={(e) => setFunds(e.target.value)}
                    placeholder="Enter amount"
                    disabled={isTransferring}
                  />
                </div>
                {transferError && (
                  <p className="mt-2 text-sm text-red-500">{transferError}</p>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!funds || isSubmitting || isTransferring}
                  className="mt-4 w-full"
                >
                  {isTransferring ? (
                    "Processing Transfer..."
                  ) : isSubmitting ? (
                    "Submitting..."
                  ) : (
                    "Submit Investment"
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}