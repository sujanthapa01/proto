'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import axios from 'axios'

interface User {
  id: string
  content: string
  username: string | null
  createdAt: string
}

interface UserListProps {
  users: User[]
  loading: boolean
  error: string | null
  fnc: () => void
}

const UserList: React.FC<UserListProps> = ({ users, loading, error, fnc }) => {
  const deleteUser = async (userid: string) => {
    try {
      const response = await axios.post('/api/deleteMessage', {
        messageId: userid
      })
      console.log(response.data)
      fnc()
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  const handleDeleteClick = (userid: string) => {
    deleteUser(userid)
  }

  return (
    <AnimatePresence>
      {!loading && !error && users.length > 0 && (
        <motion.div
          layout
          className="max-h-[700px] rounded w-full max-w-md mx-auto overflow-y-auto pr-2 flex flex-col gap-4 items-center scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {users.map(({ content, username, id }) => (
            <div
              className="flex gap-4 w-full justify-between items-center"
              key={id}
            >
              <div className="min-w-[60px] max-w-[100px] text-xs text-center text-gray-300 truncate">
                {username ?? id.slice(0, 6) + '...'}
              </div>

              <motion.span
                className="text-white bg-indigo-700 py-4 px-4 min-w-[5rem] rounded w-full"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                layout
              >
                {content || `${id} joined`}
              </motion.span>

              <Button
                className="bg-red-500/50 cursor-pointer h-full"
                variant="destructive"
                onClick={() => handleDeleteClick(id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </motion.div>
      )}

      {!loading && !error && users.length === 0 && (
        <motion.p
          className="text-gray-500 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No messages yet.
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export default UserList
