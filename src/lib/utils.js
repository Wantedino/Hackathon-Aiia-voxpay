import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Hoje';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  } else {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(d);
  }
}

export function getCategoryIcon(category) {
  const icons = {
    food: 'UtensilsCrossed',
    transport: 'Car',
    entertainment: 'Tv',
    bills: 'FileText',
    health: 'Heart',
    salary: 'Briefcase',
    freelance: 'Laptop',
    cashback: 'Gift',
    shopping: 'ShoppingBag',
    transfer: 'ArrowRightLeft',
    other: 'Circle',
  };
  return icons[category] || 'Circle';
}

export function getCategoryColor(category) {
  const colors = {
    food: 'text-orange-500',
    transport: 'text-blue-500',
    entertainment: 'text-pink-500',
    bills: 'text-yellow-500',
    health: 'text-red-400',
    salary: 'text-green-500',
    freelance: 'text-amber-400',
    cashback: 'text-green-400',
    shopping: 'text-indigo-500',
    transfer: 'text-amber-500',
    other: 'text-gray-500',
  };
  return colors[category] || 'text-gray-500';
}

export function getCategoryName(category) {
  const names = {
    food: 'Alimentação',
    transport: 'Transporte',
    entertainment: 'Entretenimento',
    bills: 'Contas',
    health: 'Saúde',
    salary: 'Salário',
    freelance: 'Freelance',
    cashback: 'Cashback',
    shopping: 'Compras',
    transfer: 'Transferência',
    other: 'Outros',
  };
  return names[category] || 'Outros';
}
