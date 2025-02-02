import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Question {
  text: string
  options: string[]
}

interface Coin {
  id: string
  name: string
  symbol: string
  logo: string
  price: number
  marketCap: number
  volume24h: number
}

interface GraphData {
  timestamp: number
  price: number
  movingAverage: number
  momentum: number
}

const questions: Question[] = [
  {
    text: "What's your preferred trading frequency?",
    options: ["Daily", "Weekly", "Monthly"],
  },
  {
    text: "What's your risk tolerance for the AI agent?",
    options: ["Low", "Medium", "High"],
  },
  {
    text: "What's your preferred trading strategy?",
    options: ["Trend Following", "Mean Reversion", "Momentum"],
  },
]

export default function SmartTrading() {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""))
  const [showCoinSelection, setShowCoinSelection] = useState(false)
  const [coins, setCoins] = useState<Coin[]>([])
  const [filter, setFilter] = useState("")
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin; direction: "asc" | "desc" }>({
    key: "marketCap",
    direction: "desc",
  })
  const [graphData, setGraphData] = useState<GraphData[]>([])
  const [loading, setLoading] = useState(false)

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmitAnswers = async () => {
    // Simulating API call to get coin data
    const response = await fetch("/api/coins")
    const data = await response.json()
    setCoins(data)
    setShowCoinSelection(true)
  }

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(filter.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(filter.toLowerCase()),
  )

  const sortedCoins = useMemo(() => {
    const sortableCoins = [...filteredCoins]
    if (sortConfig !== null) {
      sortableCoins.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableCoins
  }, [filteredCoins, sortConfig])

  const handleCoinSelect = async (coinId: string) => {
    setSelectedCoin(coinId)
    setLoading(true)
    try {
      // Simulating API call to get graph data
      const response = await fetch(`/api/graph-data?coinId=${coinId}`)
      const data = await response.json()
      setGraphData(data)
    } catch (error) {
      console.error("Error fetching graph data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitInvestment = () => {
    // Implement investment submission logic here
    console.log("Investment submitted:", { selectedCoin, investmentAmount, answers })
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Smart Trading Agent Setup</h2>

      {!showCoinSelection && (
        <>
          <Progress value={(answers.filter((a) => a !== "").length / questions.length) * 100} className="mb-8" />
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <Button
                      key={option}
                      variant={answers[index] === option ? "default" : "outline"}
                      onClick={() => handleAnswerChange(index, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleSubmitAnswers} className="mt-8">
            Submit Answers
          </Button>
        </>
      )}

      <AnimatePresence>
        {showCoinSelection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Select a Coin for Smart Trading</h3>
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Search coins..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortConfig({ key: "price", direction: "asc" })}>
                    Price (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortConfig({ key: "price", direction: "desc" })}>
                    Price (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortConfig({ key: "marketCap", direction: "desc" })}>
                    Market Cap (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortConfig({ key: "volume24h", direction: "desc" })}>
                    24h Volume (High to Low)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSortConfig({ key: "price", direction: sortConfig.direction === "asc" ? "desc" : "asc" })
                        }
                      >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSortConfig({
                            key: "marketCap",
                            direction: sortConfig.direction === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        Market Cap
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSortConfig({
                            key: "volume24h",
                            direction: sortConfig.direction === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        24h Volume
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCoins.map((coin) => (
                    <TableRow key={coin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <img src={coin.logo || "/placeholder.svg"} alt={coin.name} className="w-6 h-6 mr-2" />
                          {coin.name} ({coin.symbol})
                        </div>
                      </TableCell>
                      <TableCell>${coin.price.toLocaleString()}</TableCell>
                      <TableCell>${coin.marketCap.toLocaleString()}</TableCell>
                      <TableCell>${coin.volume24h.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant={selectedCoin === coin.id ? "default" : "outline"}
                          onClick={() => handleCoinSelect(coin.id)}
                        >
                          {selectedCoin === coin.id ? "Selected" : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {selectedCoin && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Strategy Graphs</h3>
                {loading ? (
                  <div>Loading graph data...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ChartContainer
                      config={{
                        price: { label: "Price", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={graphData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                          />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="price" stroke="var(--color-price)" name="Price" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer
                      config={{
                        movingAverage: { label: "Moving Average", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={graphData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                          />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="movingAverage"
                            stroke="var(--color-movingAverage)"
                            name="Moving Average"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer
                      config={{
                        momentum: { label: "Momentum", color: "hsl(var(--chart-3))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={graphData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                          />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="momentum" stroke="var(--color-momentum)" name="Momentum" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                )}

                <div className="mt-8">
                  <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="mb-4"
                  />
                  <Button onClick={handleSubmitInvestment}>Start Smart Trading</Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

