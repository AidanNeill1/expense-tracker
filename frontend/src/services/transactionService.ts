import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category?: string;
  transactionType: string;
}

export const transactionService = {
  async getTransactions(token: string): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform the data to match our Transaction interface
      return response.data.map((transaction: any) => ({
        id: transaction.id.toString(),
        date: transaction.date,
        description: transaction.details || transaction.description,
        amount: parseFloat(transaction.amount),
        type: parseFloat(transaction.amount) >= 0 ? 'credit' : 'debit',
        category: transaction.category,
        transactionType: transaction.type
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
}; 