'use client'
import React, { useEffect, useId, useState } from 'react'
import axios from 'axios'
import UserList from '@/components/userList'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function Index() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  // message contain actual messages
  const [message, setmessage] = useState<string>('')
  const [email, setEmail] = useState<string | null>('')

  console.log("data", data)

  const router = useRouter()
  useEffect(() => {
    setEmail(localStorage.getItem('email'))
    const checkLogin = async () => {
      const { data } = await supabase.from('User').select('id,is_login',).eq('email', localStorage.getItem('email')).single()
      console.log(data)
      localStorage.setItem('id', data?.id)
      const isLoggedIn = data?.is_login;
      console.log("is_login", isLoggedIn)
      if (isLoggedIn !== true) {
        router.push('/')
      }
    }
    checkLogin()
  }, [])

  const searchParams = useSearchParams()
  const params = searchParams.get("content")


  const url = params ? `/api/getUsers?content=${params}` : "/api/getUsers"


  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(url, {
        timeout: 20000,
      })

      setData(response.data.data)
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError("Request timed out after 20 seconds.")
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])




  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const userId = localStorage.getItem('id')
    console.log(message, userId)
    try {
      if (message === '') return
      const response = await axios.post('/api/message', { message: message, userId :userId }, { timeout: 20000 })
      if (response.data.ok) {
        console.log('success', response.data.user)
        const newUser = response.data.user
        setData((prev) => [newUser, ...prev])
        setmessage('')
      }

      await fetchUsers()
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError("Request timed out after 20 seconds.")
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)

    try {

      const userMail = localStorage.getItem('email')
      console.log(userMail)
      const response = await axios.post('/api/auth', { userMail, type: 'logout' }, { timeout: 20000 })
      console.log(response.data)
      localStorage.removeItem('email')
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        setError("Request timed out after 20 seconds.")
      } else {
        setError("Something went wrong.")
      }

    }
  }

  return (
    <div className="flex h-screen w-full justify-center items-center flex-col">
      <h1>{email}</h1>
      <div className="space-y-6 w-full max-w-md px-4 text-center flex flex-col items-center justify-center">
        {loading && <p>Loading...</p>}
        {!loading && error && <p className="text-red-500">{error}</p>}


        <div className="w-full">
          <UserList users={data} loading={loading} error={error} fnc={fetchUsers} />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            className="bg-amber-50 h-8 text-black w-full rounded px-2"
          />
          <button
            onClick={fetchData}
            className="h-[32px] w-[80px] rounded-full bg-yellow-500 text-black cursor-pointer"
          >
            save
          </button>
        </div>
        <Button onClick={logout}>logout</Button>

      </div>
    </div>

  )
}

export default Index
