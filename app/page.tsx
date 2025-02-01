"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "../components/Header"
import CardSelection from "../components/CardSelection"
import BaseBasket from "../components/BaseBasket"
import SmartTrading from "../components/SmartTrading"
import SignIn from "../components/SignIn"
import Navbar from "@/components/navbar"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCard, setSelectedCard] = useState<"baseBasket" | "smartTrading">("baseBasket")
  const [showSignIn, setShowSignIn] = useState(false)

  const handleLogin = () => {
    setShowSignIn(true)
  }

  const handleSignup = () => {
    // Implement signup logic
    console.log("Signup clicked")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleSignIn = (email: string, password: string) => {
    // Implement actual authentication logic here
    console.log("Signing in with:", email, password)
    setIsLoggedIn(true)
    setShowSignIn(false)
  }

  const handleCardSelect = (card: "baseBasket" | "smartTrading") => {
    if (!isLoggedIn) {
      setShowSignIn(true)
    } else {
      setSelectedCard(card)
    }
  }

  const handleBaseBasketSubmit = async (answers: string[], selectedCoin: string, funds: number) => {
    // Implement API call here
    console.log("Submitting answers:", answers, "selected coin:", selectedCoin, "and funds:", funds)
    try {
      // Simulating API call
      const response = await new Promise<{ success: boolean }>((resolve) =>
        setTimeout(() => resolve({ success: true }), 1000),
      )
      if (response.success) {
        alert("Submission successful!")
      } else {
        alert("Submission failed. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting data:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    // <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-100 to-white p-5">
      <Navbar />
      {/* <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onSignup={handleSignup} onLogout={handleLogout} /> */}
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {showSignIn ? (
            <SignIn onSignIn={handleSignIn} />
          ) : (
            <>
              <CardSelection onSelectCard={handleCardSelect} />
              {isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {selectedCard === "baseBasket" ? <BaseBasket onSubmit={handleBaseBasketSubmit} /> : <SmartTrading />}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}

