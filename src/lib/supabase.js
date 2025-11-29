import { createClient } from '@supabase/supabase-js';

// Mock data - você pode substituir por suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data para demonstração
export const mockTransactions = [
  {
    id: 1,
    title: 'Salário',
    amount: 5500.00,
    type: 'income',
    category: 'salary',
    date: '2025-11-25T10:00:00',
  },
  {
    id: 2,
    title: 'Supermercado Extra',
    amount: -234.50,
    type: 'expense',
    category: 'food',
    date: '2025-11-26T18:30:00',
  },
  {
    id: 3,
    title: 'Uber - Centro',
    amount: -25.80,
    type: 'expense',
    category: 'transport',
    date: '2025-11-26T09:15:00',
  },
  {
    id: 4,
    title: 'Netflix',
    amount: -39.90,
    type: 'expense',
    category: 'entertainment',
    date: '2025-11-24T00:00:00',
  },
  {
    id: 5,
    title: 'iFood - Restaurante',
    amount: -68.40,
    type: 'expense',
    category: 'food',
    date: '2025-11-25T20:30:00',
  },
  {
    id: 6,
    title: 'Freelance Design',
    amount: 850.00,
    type: 'income',
    category: 'freelance',
    date: '2025-11-23T14:00:00',
  },
  {
    id: 7,
    title: 'Conta de Luz',
    amount: -185.30,
    type: 'expense',
    category: 'bills',
    date: '2025-11-20T00:00:00',
  },
  {
    id: 8,
    title: 'Farmácia Droga Raia',
    amount: -47.90,
    type: 'expense',
    category: 'health',
    date: '2025-11-26T16:45:00',
  },
  {
    id: 9,
    title: 'Uber - Trabalho',
    amount: -32.50,
    type: 'expense',
    category: 'transport',
    date: '2025-11-25T08:00:00',
  },
  {
    id: 10,
    title: 'Cashback Nubank',
    amount: 15.50,
    type: 'income',
    category: 'cashback',
    date: '2025-11-24T12:00:00',
  },
  {
    id: 11,
    title: 'Spotify',
    amount: -21.90,
    type: 'expense',
    category: 'entertainment',
    date: '2025-11-22T00:00:00',
  },
  {
    id: 12,
    title: 'Padaria',
    amount: -12.50,
    type: 'expense',
    category: 'food',
    date: '2025-11-27T07:30:00',
  },
];

export const mockGoals = [
  {
    id: 1,
    title: 'Fundo de Emergência',
    target: 10000,
    current: 4500,
    icon: 'shield',
  },
  {
    id: 2,
    title: 'Viagem Europa',
    target: 15000,
    current: 8200,
    icon: 'plane',
  },
];

export const mockUser = {
  name: 'Erick Mendonça',
  avatar: null,
};
