import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { cn } from '../lib/utils'
import { Transaction } from '../services/transactionService'

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  })

  // Get unique transaction types for the filter
  const transactionTypes = Array.from(new Set(transactions.map(t => t.transactionType)))

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    const matchesTransactionType = transactionTypeFilter === 'all' || transaction.transactionType === transactionTypeFilter
    
    // Date filtering
    const transactionDate = new Date(transaction.date)
    const startDate = dateRange.start ? new Date(dateRange.start) : null
    const endDate = dateRange.end ? new Date(dateRange.end) : null
    
    const matchesDateRange = (!startDate || transactionDate >= startDate) && 
                           (!endDate || transactionDate <= endDate)

    return matchesSearch && matchesType && matchesTransactionType && matchesDateRange
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as 'all' | 'credit' | 'debit')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Amount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="credit">Credits</SelectItem>
              <SelectItem value="debit">Debits</SelectItem>
            </SelectContent>
          </Select>
          <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {transactionTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            placeholder="Start date"
          />
        </div>
        <div className="flex-1">
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            placeholder="End date"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.transactionType}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category || 'Uncategorized'}</TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {new Intl.NumberFormat('en-ZA', {
                      style: 'currency',
                      currency: 'ZAR'
                    }).format(Math.abs(transaction.amount))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 