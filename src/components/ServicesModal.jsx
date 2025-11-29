import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Shield, Landmark, CreditCard, PiggyBank, X, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const services = [
  {
    id: 'insurance',
    icon: Shield,
    title: 'Seguros',
    description: 'Proteja seu patrimônio e sua família',
    color: 'text-blue-500',
    bgColor: 'bg-blue-600/20',
  },
  {
    id: 'loan',
    icon: Landmark,
    title: 'Empréstimos',
    description: 'Taxas a partir de 1,2% ao mês',
    color: 'text-orange-500',
    bgColor: 'bg-orange-600/20',
  },
  {
    id: 'cards',
    icon: CreditCard,
    title: 'Cartões',
    description: 'Sem anuidade e cashback garantido',
    color: 'text-pink-500',
    bgColor: 'bg-pink-600/20',
  },
  {
    id: 'investments',
    icon: PiggyBank,
    title: 'Investimentos',
    description: 'Faça seu dinheiro render mais',
    color: 'text-amber-500',
    bgColor: 'bg-amber-600/20',
  },
];

export default function ServicesModal({ serviceId, onClose }) {
  const { addTransaction, balance } = useApp();
  const { showToast } = useToast();
  const service = services.find((s) => s.id === serviceId) || services[0];
  const Icon = service.icon;
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  const formatAmountInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const num = parseFloat(numbers) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleBuyInsurance = (cost) => {
    const res = addTransaction({ title: 'Seguro', amount: -cost, type: 'expense', category: 'insurance' });
    if (!res || res.success === false) {
      showToast({ title: 'Saldo insuficiente', message: 'Saldo insuficiente para contratar o seguro.', type: 'error' });
      return;
    }
    setSuccess(`Seguro contratado. ${formatCurrency(cost)} debitados`);
    setTimeout(() => onClose(), 1500);
  };

  const handleRequestLoan = () => {
    const value = parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.'));
    if (isNaN(value) || value <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      addTransaction({ title: `Empréstimo ${formatCurrency(value)}`, amount: value, type: 'income', category: 'loan' });
      setSuccess(`Empréstimo de ${formatCurrency(value)} creditado`);
      setProcessing(false);
      setTimeout(() => onClose(), 1500);
    }, 900);
  };

  const handleInvest = () => {
    const value = parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.'));
    if (isNaN(value) || value <= 0) return;
    if (value > balance) {
      showToast({ title: 'Saldo insuficiente', message: 'Saldo insuficiente para investir.', type: 'error' });
      return;
    }
    const res = addTransaction({ title: `Investimento ${formatCurrency(value)}`, amount: -value, type: 'expense', category: 'investment' });
    if (!res || res.success === false) {
      showToast({ title: 'Saldo insuficiente', message: 'Saldo insuficiente para investir.', type: 'error' });
      return;
    }
    setSuccess(`Investido ${formatCurrency(value)}. Veja em breve o rendimento.`);
    setTimeout(() => onClose(), 1500);
  };

  const handleRequestCard = () => {
    setSuccess('Solicitação enviada. Você receberá uma resposta em 24h.');
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-lg animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${service.bgColor} rounded-xl`}>
              <Icon className={`w-6 h-6 ${service.color}`} />
            </div>
            <CardTitle className="text-xl">{service.title}</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`${service.bgColor} rounded-2xl p-6`}>
            <p className="text-lg font-semibold text-white mb-2">{service.description}</p>
            <p className="text-sm text-gray-400">Explore nossas opções exclusivas e encontre a melhor solução para você.</p>
          </div>

          {serviceId === 'insurance' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Planos a partir de R$49,90/mês</p>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleBuyInsurance(49.9)} className="w-full">Contratar Básico R$49,90</Button>
                <Button onClick={() => handleBuyInsurance(99.9)} variant="secondary" className="w-full">Premium R$99,90</Button>
              </div>
            </div>
          )}

          {serviceId === 'loan' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Solicite um empréstimo com aprovação simulada</p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor do Empréstimo</label>
                <Input placeholder="0,00" value={amount} onChange={(e) => setAmount(formatAmountInput(e.target.value))} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRequestLoan} disabled={processing} className="flex-1">Solicitar</Button>
                <Button variant="secondary" onClick={() => { setAmount(''); onClose(); }} className="flex-1">Cancelar</Button>
              </div>
            </div>
          )}

          {serviceId === 'investments' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Invista e acompanhe o rendimento</p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor para Investir</label>
                <Input placeholder="0,00" value={amount} onChange={(e) => setAmount(formatAmountInput(e.target.value))} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleInvest} className="flex-1">Investir</Button>
                <Button variant="secondary" onClick={() => { setAmount(''); onClose(); }} className="flex-1">Cancelar</Button>
              </div>
            </div>
          )}

          {serviceId === 'cards' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Peça seu cartão agora — sem custo de solicitação</p>
              <div className="flex gap-2">
                <Button onClick={handleRequestCard} className="flex-1">Pedir Cartão</Button>
                <Button variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-600/20 rounded-xl p-3 text-green-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div className="text-sm">{success}</div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
