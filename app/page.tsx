"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "../components/Header"
import CardSelection from "../components/CardSelection"
import BaseBasket from "../components/BaseBasket"
import SmartTrading from "../components/SmartTrading"
import Navbar from "@/components/navbar"

export default function Home() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCard, setSelectedCard] = useState<"baseBasket" | "smartTrading">("baseBasket")
  // const [showSignIn, setShowSignIn] = useState(false)

  // Commenting out sign-in/sign-up related functions
  /*
  const handleLogin = () => {
    setShowSignIn(true)
  }

  const handleSignup = () => {
    console.log("Signup clicked")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleSignIn = (email: string, password: string) => {
    console.log("Signing in with:", email, password)
    setIsLoggedIn(true)
    setShowSignIn(false)
  }
  */

  const handleCardSelect = (card: "baseBasket" | "smartTrading") => {
    // if (!isLoggedIn) {
    //   setShowSignIn(true)
    // } else {
    setSelectedCard(card)
    // }
  }

  const handleBaseBasketSubmit = async (answers: string[], selectedCoin: string, funds: number) => {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">

      <Navbar></Navbar>
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* {showSignIn ? (
            <SignIn onSignIn={handleSignIn} />
          ) : ( */}
          <>
            <CardSelection onSelectCard={handleCardSelect} />
            {/* {isLoggedIn && ( */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {selectedCard === "baseBasket" ? <BaseBasket onSubmit={handleBaseBasketSubmit} /> : <SmartTrading />}
            </motion.div>
            {/* )} */}
          </>
          {/* )} */}
        </motion.div>
      </main>
    </div>
  )
}

