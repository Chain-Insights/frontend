import { NextResponse } from "next/server"

function generateMockData(days: number) {
  const data = []
  const now = Date.now()
  let price = 100 // Starting price
  let movingAverage = 100
  let momentum = 0

  for (let i = 0; i < days; i++) {
    const timestamp = now - (days - i) * 24 * 60 * 60 * 1000 // go back in time
    price = price + (Math.random() - 0.5) * 10 // Random walk
    movingAverage = (movingAverage * 9 + price) / 10 // Simple moving average
    momentum = price - movingAverage

    data.push({
      timestamp,
      price,
      movingAverage,
      momentum,
    })
  }

  return data
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coinId = searchParams.get("coinId")

  // In a real application, you would use the coinId to fetch real data
  // For this example, we're generating mock data
  const mockData = generateMockData(30) // 30 days of data

  return NextResponse.json(mockData)
}

