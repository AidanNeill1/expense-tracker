import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransactionsTable } from '@/components/TransactionsTable'
import { Transaction, transactionService } from '@/services/transactionService'

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        
        if (!token) {
          // Redirect to login if no token found
          navigate('/login', { 
            state: { 
              from: '/transactions',
              message: 'Please log in to view your transactions' 
            } 
          })
          return
        }
        
        const data = await transactionService.getTransactions(token)
        setTransactions(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions'
        setError(errorMessage)
        
        // If we get a 401 unauthorized error, redirect to login
        if (err?.response?.status === 401) {
          localStorage.removeItem('token') // Clear invalid token
          navigate('/login', { 
            state: { 
              from: '/transactions',
              message: 'Your session has expired. Please log in again.' 
            } 
          })
          return
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
        <p className="text-lg text-muted-foreground mt-2">
          View and manage your transactions
        </p>
      </div>
      <TransactionsTable transactions={transactions} />
    </div>
  )
} 