import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SignInProps {
  onSignIn: (email: string, password: string) => void
}

export default function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignIn(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Password</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit">Sign In</Button>
    </form>
  )
}

