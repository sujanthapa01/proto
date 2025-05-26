'use client'
import React, { useEffect, useState } from 'react'
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
  const [nameInput, setNameInput] = useState<string>('')

  const router = useRouter()
  useEffect(() => {
    const checkLogin = async () => {
      const { data, error } = await supabase.from('User').select('is_login')
      const isLoggedIn = data && data[0]?.is_login;
      console.log(isLoggedIn)
      if (!isLoggedIn ) {
        router.push('/')
      }
    }
    checkLogin()
  },[])

  const searchParams = useSearchParams()
  const params = searchParams.get("name")


  const url = params ? `/api/getUsers?name=${params}` : "/api/getUsers"


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
    try {
      if (nameInput === '') return
      const response = await axios.post('/api/nameinput', { name: nameInput }, { timeout: 20000 })
      if (response.data.ok) {
        console.log('success', response.data.user)
        const newUser = response.data.user
        setData((prev) => [newUser, ...prev])
        setNameInput('')
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
  
 try{

  const userMail = localStorage.getItem('email')
console.log(userMail)

 const response = await axios.post('/api/auth',{userMail,type: 'logout'}, {timeout:20000})
console.log(response.data)
 }catch(error:any){
  if(error.code === 'ECONNABORTED'){
  setError("Request timed out after 20 seconds.")
  }else {
        setError("Something went wrong.")
      }
 
 }
}

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="space-y-6 w-full max-w-md px-4 text-center flex flex-col items-center justify-center">
        {loading && <p>Loading...</p>}
        {!loading && error && <p className="text-red-500">{error}</p>}


        <div className="w-full">
          <UserList users={data} loading={loading} error={error} fnc={fetchUsers} />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
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
