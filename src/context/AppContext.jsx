import React, { createContext, useContext, useState } from 'react';
import { mockTransactions, mockGoals, mockUser } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [goals, setGoals] = useState(mockGoals);
  const [user, setUser] = useState(mockUser);
  const [debts, setDebts] = useState([]); // Nova lista de dívidas
  const [darkMode, setDarkMode] = useState(true); // Modo escuro por padrão
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Pagamento recebido', message: 'Você recebeu R$ 5.500,00', read: false },
    { id: 2, title: 'Meta atingida!', message: 'Parabéns! Você atingiu 80% da meta Viagem Europa', read: false },
    { id: 3, title: 'Cashback disponível', message: 'R$ 125,50 em cashback para resgatar', read: false },
  ]);
  
  // Ações rápidas customizáveis (todas habilitadas por padrão)
  const [quickActions, setQuickActions] = useState([
    { id: 'pix', enabled: true },
    { id: 'cashback', enabled: true },
    { id: 'shop', enabled: true },
    { id: 'giftcard', enabled: true },
    { id: 'recharge', enabled: true },
    { id: 'investments', enabled: true },
    { id: 'insurance', enabled: true },
    { id: 'loan', enabled: true },
    { id: 'cards', enabled: true },
  ]);

  const addTransaction = (transaction) => {
    // validação de saldo para despesas
    const currentBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const amount = transaction.amount;
    if (amount < 0 && Math.abs(amount) > currentBalance) {
      return { success: false, message: 'Saldo insuficiente' };
    }

    const newTransaction = {
      id: transactions.length + 1,
      ...transaction,
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    return { success: true, transaction: newTransaction };
  };

  const updateGoal = (goalId, amount) => {
    // tenta debitar o valor da conta criando uma transação de despesa
    const res = addTransaction({
      title: `Transferência para meta #${goalId}`,
      amount: -amount,
      type: 'expense',
      category: 'goal',
    });

    if (!res || res.success === false) {
      return { success: false, message: res?.message || 'Erro ao transferir para a meta' };
    }

    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
        : goal
    ));

    return { success: true };
  };

  const addGoal = (goal) => {
    const newGoal = {
      id: goals.length + 1,
      ...goal,
      current: 0,
    };
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const addDebt = (debt) => {
    const newDebt = {
      id: debts.length + 1,
      ...debt,
      paid: 0,
      createdAt: new Date().toISOString(),
    };
    setDebts([...debts, newDebt]);
    return newDebt;
  };

  const updateDebt = (debtId, amount) => {
    // tenta debitar o valor da conta criando uma transação de despesa
    const res = addTransaction({
      title: `Pagamento de dívida #${debtId}`,
      amount: -amount,
      type: 'expense',
      category: 'debt',
    });

    if (!res || res.success === false) {
      return { success: false, message: res?.message || 'Erro ao pagar dívida' };
    }

    setDebts(debts.map(debt => 
      debt.id === debtId 
        ? { ...debt, paid: Math.min(debt.paid + amount, debt.total) }
        : debt
    ));

    return { success: true };
  };

  const deleteDebt = (debtId) => {
    setDebts(debts.filter(debt => debt.id !== debtId));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const updateQuickActions = (actions) => {
    setQuickActions(actions);
    return true;
  };

  const toggleQuickAction = (actionId) => {
    const updatedActions = quickActions.map(action =>
      action.id === actionId ? { ...action, enabled: !action.enabled } : action
    );
    
    setQuickActions(updatedActions);
    return true;
  };

  const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppContext.Provider value={{
      transactions,
      goals,
      user,
      notifications,
      balance,
      income,
      expenses,
      quickActions,
      debts,
      darkMode,
      addTransaction,
      updateGoal,
      addGoal,
      addDebt,
      updateDebt,
      deleteDebt,
      markNotificationAsRead,
      setUser,
      updateQuickActions,
      toggleQuickAction,
      toggleDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
