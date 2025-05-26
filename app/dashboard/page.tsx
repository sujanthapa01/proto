'use client'

import React, { use, useCallback, useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import axios from 'axios'

function Page() {
  const [userEmail, setUserEmail] = useState<string | null>('')
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
const [error, setError] = useState<string | null>(null)
  console.log(isPrivate)
  const emailCallback = useCallback(() => {
    const email = localStorage.getItem('email')
    setUserEmail(email)
  }, [])

  useEffect(() => {
    emailCallback()
  }, [emailCallback])

  const handleVisibilityChange = (value: string) => {
    setIsPrivate(value === 'private')
  }

  const handleSave = async () => {
  
    try{
        const response = await axios.post('/api/userUpdates', {email : userEmail, isPrivate}, {timeout: 20000})
    }catch(error: any){
        if(error.code === 'ECONNABORTED'){
            setError('timeout for 20s')
        }
    }
   
  }

  return (
    <div className="flex h-screen w-full justify-center items-center">
        {error && error}
      <div className="flex justify-center gap-x-2 flex-col items-center">
        <p>Logged in as - {userEmail}</p>
        <div className="flex mt-4 gap-4">
          <Select value={isPrivate ? 'private' : 'public'} onValueChange={handleVisibilityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Change visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}

export default Page
