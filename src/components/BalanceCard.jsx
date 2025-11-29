import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function BalanceCard() {
  const { balance, income, expenses, darkMode } = useApp();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Card className={`shadow-xl transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Saldo Total
          </CardTitle>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className={`p-1.5 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
          >
            {showBalance ? (
              <Eye className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            ) : (
              <EyeOff className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h2 className={`text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {showBalance ? formatCurrency(balance) : '••••••'}
          </h2>
        </div>

        <div className={`flex items-center justify-between pt-3 border-t ${
          darkMode ? 'border-slate-700/50' : 'border-gray-200'
        }`}>
          <div className="flex-1">
            <p className={`text-xs mb-1 flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Entradas
            </p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
              {showBalance ? formatCurrency(income) : '••••••'}
            </p>
          </div>
          <div className={`w-px h-10 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-200'}`}></div>
          <div className="flex-1 text-right">
            <p className={`text-xs mb-1 flex items-center justify-end gap-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Saídas
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            </p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
              {showBalance ? formatCurrency(expenses) : '••••••'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
