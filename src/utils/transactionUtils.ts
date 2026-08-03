// src/utils/transactionUtils.ts
import type { Transaction, TransactionStats } from '../types/type';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};



export const calculateStats = (transactions: Transaction[]): TransactionStats => {
  return transactions.reduce<TransactionStats>(
    (stats, transaction) => {
      const amount = Number(transaction.amount) || 0; // ✅ convert to number safely

      stats.total += 1;
      stats.totalRevenue += amount;

      if (transaction.status === "paid") stats.paid += 1;
      else if (transaction.status === "pending") stats.pending += 1;
      else if (transaction.status === "failed") stats.failed += 1;

      return stats;
    },
    {
      total: 0,
      paid: 0,
      pending: 0,
      failed: 0,
      totalRevenue: 0,
    }
  );
};

