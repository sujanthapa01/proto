'use client'
import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { z } from 'zod'
import axios from 'axios'
import { motion } from 'framer-motion'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'atleast 6 letters are required').regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special symbol"),
    username: z.string().min(3, 'Username must be at least 3 characters long').max(20, 'Username must be at most 20 characters long')
});


const signupSchema = loginSchema.extend({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long'),
})
type User = z.infer<typeof loginSchema>

function Auth() {
    const [fromData, setFromData] = useState<User>({
        email: '',
        password: '',
        username: ''
        
    })
    const [error, setError] = useState<string | null>('')


    const handlelogin = async () => {
        const type = 'login'
        const result = loginSchema.safeParse(fromData)
        console.log(result)
        if (!result.success) {
            setError(result.error.errors[0].message);
            return
        }
        try {

            const response = await axios.post('/api/auth', { ...fromData, type })
            if (response) {
                console.log(response.data)
            }
            localStorage.setItem('email', fromData.email)
        } catch (e) {
            setError("faild to login")
        } 

        setError(null);
        console.log('✅ Valid data:', result.data);

    }


    const signup = async () => {

        const result = signupSchema.safeParse(fromData)
        if(!result.success){
               setError(result.error.errors[0].message);
               return
        }

        try {

             localStorage.setItem('email', fromData.email)
            const response = await axios.post('/api/auth', { ...fromData, type: 'signup' }, { timeout: 20000 })
            console.log(response.data)

        } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
                setError("timeout for 20sec")
            }
        }


    }



    return (
        <div className='flex justify-center flex-col'>
            {error && (<motion.div initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className=' rounded-4xl bg-red-400 p-2 mb-4'>{error}</motion.div>)}
            <Tabs defaultValue='login' className='w-[400px]'>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login </TabsTrigger>
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>

                <TabsContent value='login'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>login your for editing</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={fromData?.email} onChange={(e) => setFromData((prev) => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Pssword</Label>
                                <Input id="password" value={fromData?.password} onChange={(e) => setFromData((prev) => ({ ...prev, password: e.target.value }))} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handlelogin}>Login</Button>
                        </CardFooter>
                    </Card>

                </TabsContent>
                <TabsContent value='signup'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>create an account</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={fromData?.email} onChange={(e) => setFromData((prev) => ({ ...prev, email: e.target.value }))} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="email">Username</Label>
                                <Input id="email" value={fromData?.username} onChange={(e) => setFromData((prev) => ({ ...prev, username: e.target.value }))} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Pssword</Label>
                                <Input id="password" value={fromData?.password} onChange={(e) => setFromData((prev) => ({...prev, password: e.target.value}))} />
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button onClick={signup}>signup</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>



            </Tabs>
        </div>
    )
}

export default Auth