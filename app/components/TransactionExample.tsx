'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Transaction {
  id: string
  amount: number
  description: string
  category: string | null
  type: string
  created_at: string
}

export default function TransactionExample() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  // Fetch transactions
  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!description || !amount) return

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            description,
            amount: parseFloat(amount),
            type: 'expense',
          },
        ])

      if (error) throw error

      // Clear form and refresh transactions
      setDescription('')
      setAmount('')
      fetchTransactions()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  if (loading) {
    return <div className="p-4">Loading transactions...</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Budget Transactions</h2>
      
      {/* Add Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Add New Transaction</h3>
        <div className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </div>
      </form>

      {/* Transactions List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet. Add one above!</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-3 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-500">{transaction.type}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
