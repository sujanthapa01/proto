'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import UserList from '@/components/userList'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

function Index() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const params = searchParams.get("content")
  const url = params ? `/api/getUsers?content=${params}` : "/api/getUsers"

  // ✅ Fetch messages from API
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(url, { timeout: 20000 })
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

  // ✅ Send a new message
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const userId = localStorage.getItem('id')

    try {
      if (!message.trim()) return

      const response = await axios.post('/api/message', {
        message,
        userId
      }, { timeout: 20000 })

      if (response.data.ok) {
        const newUser = response.data.user
        setData((prev) => [newUser, ...prev])
        setMessage('')
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

  // ✅ Logout
  const logout = async () => {
    setLoading(true)
    setError(null)

    try {
      const userMail = localStorage.getItem('email')
      const response = await axios.post('/api/auth', {
        userMail,
        type: 'logout'
      }, { timeout: 20000 })

      localStorage.removeItem('email')
      localStorage.removeItem('id')
      router.push('/')
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        setError("Request timed out after 20 seconds.")
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ useEffect: auth check + fetch + real-time subscription
  useEffect(() => {
    const init = async () => {
      const emailFromStorage = localStorage.getItem('email')
      setEmail(emailFromStorage)

      const { data } = await supabase
        .from('User')
        .select('id, is_login')
        .eq('email', emailFromStorage)
        .single()

      if (data?.id) {
        localStorage.setItem('id', data.id)
      }

      if (!data?.is_login) {
        router.push('/')
        return
      }

      await fetchUsers()

      // ✅ Setup real-time subscription
      const channel = supabase
        .channel('messages-listener')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'Messeges'
          },
          (payload) => {
            console.log('Realtime update received:', payload)
            fetchUsers() // re-fetch data
          }
        )
        .subscribe()

      // ✅ Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel)
      }
    }

    init()
  }, [])

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
            onChange={(e) => setMessage(e.target.value)}
            className="bg-amber-50 h-8 text-black w-full rounded px-2"
          />
          <button
            onClick={fetchData}
            className="h-[32px] w-[80px] rounded-full bg-yellow-500 text-black cursor-pointer"
          >
            Save
          </button>
        </div>

        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  )
}

export default Index
