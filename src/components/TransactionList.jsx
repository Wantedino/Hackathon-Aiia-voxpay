import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor, getCategoryName } from '../lib/utils';
import * as LucideIcons from 'lucide-react';
import { Button } from './ui';

export default function TransactionList() {
  const { transactions } = useApp();
  const [filter, setFilter] = useState('all'); // all, income, expense

  const filteredTransactions = transactions
    .filter((t) => {
      if (filter === 'all') return true;
      return t.type === filter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Agrupar por data
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Extrato</h3>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'secondary'}
          onClick={() => setFilter('all')}
          className="flex-1"
        >
          Tudo
        </Button>
        <Button
          size="sm"
          variant={filter === 'income' ? 'default' : 'secondary'}
          onClick={() => setFilter('income')}
          className="flex-1"
        >
          Entradas
        </Button>
        <Button
          size="sm"
          variant={filter === 'expense' ? 'default' : 'secondary'}
          onClick={() => setFilter('expense')}
          className="flex-1"
        >
          Saídas
        </Button>
      </div>

      {/* Lista de transações */}
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date} className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 px-1">{date}</p>
            <div className="space-y-2">
              {transactions.map((transaction) => {
                const iconName = getCategoryIcon(transaction.category);
                const Icon = LucideIcons[iconName] || LucideIcons.Circle;
                const colorClass = getCategoryColor(transaction.category);
                const isIncome = transaction.type === 'income';

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 p-4 bg-[hsl(var(--card))] rounded-xl hover:bg-[hsl(var(--secondary))] transition-colors cursor-pointer"
                  >
                    <div className={`p-3 rounded-xl bg-opacity-10 ${colorClass}`}>
                      <Icon className={`w-5 h-5 ${colorClass}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {transaction.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getCategoryName(transaction.category)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold text-sm ${
                          isIncome ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {isIncome ? '+' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
