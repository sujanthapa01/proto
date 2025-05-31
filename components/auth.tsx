'use client'

import React, { useState } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter
} from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { z } from 'zod'
import axios from 'axios'
import { motion } from 'framer-motion'


const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'At least 6 characters required')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special symbol')
})

const signupSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
})


type LoginUser = z.infer<typeof loginSchema>
type SignupUser = z.infer<typeof signupSchema>
type User = SignupUser

function Auth() {
  const [formData, setFormData] = useState<User>({
    email: '',
    password: '',
    username: ''
  })

  const [error, setError] = useState<string | null>('')

  const handleLogin = async () => {
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }

    try {
      const response = await axios.post('/api/auth', { ...formData, type: 'login' })
      console.log(response.data)
      localStorage.setItem('email', formData.email)
      setError(null)
    } catch (e) {
      setError('Failed to login')
    }
  }

  const handleSignup = async () => {
    const result = signupSchema.safeParse(formData)
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }

    try {
      const response = await axios.post('/api/auth', { ...formData, type: 'signup' }, { timeout: 20000 })
      console.log(response.data)
      localStorage.setItem('email', formData.email)
      setError(null)
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out after 20 seconds')
      } else {
        setError('Failed to signup')
      }
    }
  }

  return (
    <div className="flex justify-center flex-col items-center mt-10">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg bg-red-400 text-white p-2 mb-4 w-[400px] text-center"
        >
          {error}
        </motion.div>
      )}

      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>

        {/* LOGIN FORM */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogin}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SIGNUP FORM */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignup}>Signup</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Auth
