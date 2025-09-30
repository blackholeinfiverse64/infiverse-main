"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthButton } from "@/components/ui/AuthButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "../context/auth-context"

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setLoading(true)
      try {
        await login(formData)
      } catch (error) {
        setErrors({ password: "Invalid email or password" })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center universe-background relative p-4">
      {/* Universe particle background */}
      <div className="universe-particles"></div>
      <div className="universe-particles-medium"></div>
      <div className="universe-particles-large"></div>

      <Card className="cyber-card glass glow-primary w-full max-w-md z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold gradient-text">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your <span className="text-primary">workspace</span></CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`cyber-input ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && <p className="auth-error">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`cyber-input ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && <p className="auth-error">{errors.password}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <AuthButton type="submit" loading={loading} disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Enter Workspace"}
            </AuthButton>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="auth-link">Register here</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
