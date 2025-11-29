import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui';
import { useApp } from '../context/AppContext';
import { Shield, Plane, TrendingUp, Plus, X, Target, CreditCard, Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../context/ToastContext';

const iconMap = {
  shield: Shield,
  plane: Plane,
  target: Target,
};

export default function GoalsScreen() {
  const { goals, updateGoal, addGoal, debts, addDebt, updateDebt, deleteDebt } = useApp();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('goals'); // 'goals' ou 'debts'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [showPayDebtModal, setShowPayDebtModal] = useState(false);
  const [showGoalDetailsModal, setShowGoalDetailsModal] = useState(false);
  const [showDebtDetailsModal, setShowDebtDetailsModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [amount, setAmount] = useState('');
  const [newGoal, setNewGoal] = useState({ title: '', target: '', icon: 'target' });
  const [newDebt, setNewDebt] = useState({ title: '', total: '', creditor: '', installments: '1' });

  const formatAmountInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const num = parseFloat(numbers) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAddMoney = () => {
    if (!selectedGoal || !amount) return;
    const value = parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.'));
    if (isNaN(value) || value <= 0) return;

    const res = updateGoal(selectedGoal.id, value);
    if (!res || res.success === false) {
      // exibir popup de saldo insuficiente
      setShowAddMoneyModal(false);
      setAmount('');
      setSelectedGoal(null);
      // mostra modal simples de erro
      setTimeout(() => {
        showToast({ title: 'Saldo insuficiente', message: 'Saldo insuficiente para transferir para a meta.', type: 'error' });
      }, 50);
      return;
    }

    setShowAddMoneyModal(false);
    setAmount('');
    setSelectedGoal(null);
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const targetValue = parseFloat(newGoal.target.replace(/[^0-9,]/g, '').replace(',', '.'));
    if (isNaN(targetValue) || targetValue <= 0) return;

    addGoal({
      title: newGoal.title,
      target: targetValue,
      icon: newGoal.icon,
    });

    setShowAddModal(false);
    setNewGoal({ title: '', target: '', icon: 'target' });
  };

  const handleCreateDebt = () => {
    if (!newDebt.title || !newDebt.total) return;
    const totalValue = parseFloat(newDebt.total.replace(/[^0-9,]/g, '').replace(',', '.'));
    const installments = parseInt(newDebt.installments) || 1;
    
    if (isNaN(totalValue) || totalValue <= 0) return;
    if (installments < 1 || installments > 240) {
      showToast({ title: 'Erro', message: 'Número de parcelas deve ser entre 1 e 240', type: 'error' });
      return;
    }

    const installmentValue = totalValue / installments;

    addDebt({
      title: newDebt.title,
      total: totalValue,
      creditor: newDebt.creditor || 'Não especificado',
      installments: installments,
      installmentValue: installmentValue,
      paidInstallments: 0,
    });

    setShowAddDebtModal(false);
    setNewDebt({ title: '', total: '', creditor: '', installments: '1' });
    showToast({ title: 'Dívida adicionada', message: 'Dívida registrada com sucesso', type: 'success' });
  };

  const handlePayDebt = (paymentType = 'custom') => {
    if (!selectedDebt) return;
    
    let value;
    if (paymentType === 'installment') {
      // Pagar apenas a parcela do mês
      value = selectedDebt.installmentValue;
    } else if (paymentType === 'full') {
      // Quitar a dívida completa
      value = selectedDebt.total - selectedDebt.paid;
    } else {
      // Pagamento customizado
      if (!amount) return;
      value = parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.'));
      if (isNaN(value) || value <= 0) return;
    }

    const res = updateDebt(selectedDebt.id, value);
    if (!res || res.success === false) {
      setShowPayDebtModal(false);
      setAmount('');
      setSelectedDebt(null);
      setTimeout(() => {
        showToast({ title: 'Saldo insuficiente', message: 'Saldo insuficiente para pagar a dívida.', type: 'error' });
      }, 50);
      return;
    }

    setShowPayDebtModal(false);
    setAmount('');
    setSelectedDebt(null);
    
    const message = paymentType === 'full' 
      ? 'Dívida quitada com sucesso!' 
      : paymentType === 'installment'
      ? 'Parcela paga com sucesso!'
      : 'Pagamento registrado com sucesso';
    
    showToast({ title: 'Pagamento registrado', message, type: 'success' });
  };

  const handleDeleteDebt = (debtId) => {
    deleteDebt(debtId);
    showToast({ title: 'Dívida removida', message: 'Dívida excluída com sucesso', type: 'success' });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header com Tabs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Metas & Dívidas</h2>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'goals'
                ? 'bg-amber-600 text-white'
                : 'bg-[hsl(var(--card))] text-gray-400 hover:text-gray-300'
            }`}
          >
            Metas de Economia
          </button>
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'debts'
                ? 'bg-red-600 text-white'
                : 'bg-[hsl(var(--card))] text-gray-400 hover:text-gray-300'
            }`}
          >
            Dívidas
          </button>
        </div>

        {/* Add Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {activeTab === 'goals' ? 'Continue economizando!' : 'Controle suas dívidas'}
          </p>
          <Button 
            size="icon" 
            className="rounded-full" 
            onClick={() => activeTab === 'goals' ? setShowAddModal(true) : setShowAddDebtModal(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Metas Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-4">{goals.map((goal) => {
          const Icon = iconMap[goal.icon] || TrendingUp;
          const progress = (goal.current / goal.target) * 100;
          const isCompleted = progress >= 100;

          return (
            <Card key={goal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-600/20' : 'bg-amber-600/20'}`}>
                      <Icon className={`w-6 h-6 ${isCompleted ? 'text-green-400' : 'text-amber-400'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {formatCurrency(goal.current)} de {formatCurrency(goal.target)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${isCompleted ? 'text-green-400' : 'text-amber-400'}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                        : 'bg-gradient-to-r from-amber-600 to-orange-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                {isCompleted ? (
                  <div className="mt-4 bg-green-600/20 border border-green-500/30 rounded-xl p-3 text-center">
                    <p className="text-green-400 font-semibold">🎉 Meta Atingida!</p>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowAddMoneyModal(true);
                      }}
                    >
                      Adicionar
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1" 
                      size="sm"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowGoalDetailsModal(true);
                      }}
                    >
                      Detalhes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}

      {/* Dívidas Tab */}
      {activeTab === 'debts' && (
        <div className="space-y-4">
          {debts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Nenhuma dívida registrada</p>
                <p className="text-sm text-gray-500 mt-1">Clique em + para adicionar uma dívida</p>
              </CardContent>
            </Card>
          ) : (
            debts.map((debt) => {
              const progress = (debt.paid / debt.total) * 100;
              const isFullyPaid = progress >= 100;
              const remaining = debt.total - debt.paid;
              
              // Calcular parcelas pagas baseado no valor pago
              const installmentsPaid = debt.installmentValue 
                ? Math.floor(debt.paid / debt.installmentValue)
                : debt.paidInstallments || 0;
              const installmentsRemaining = (debt.installments || 1) - installmentsPaid;

              return (
                <Card key={debt.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${isFullyPaid ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
                          <CreditCard className={`w-6 h-6 ${isFullyPaid ? 'text-green-400' : 'text-red-400'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{debt.title}</CardTitle>
                          <p className="text-sm text-gray-400 mt-1">
                            Credor: {debt.creditor}
                          </p>
                          {debt.installments && debt.installments > 1 ? (
                            <>
                              <p className="text-xs text-gray-500 mt-1">
                                {installmentsPaid}/{debt.installments} parcelas pagas
                              </p>
                              <p className="text-xs text-amber-400 font-medium mt-0.5">
                                {formatCurrency(debt.installmentValue)}/mês
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatCurrency(debt.paid)} de {formatCurrency(debt.total)} pago
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-sm font-semibold ${isFullyPaid ? 'text-green-400' : 'text-red-400'}`}>
                          {Math.round(progress)}%
                        </span>
                        <button
                          onClick={() => handleDeleteDebt(debt.id)}
                          className="p-1 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-3 overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFullyPaid 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                            : 'bg-gradient-to-r from-red-600 to-orange-600'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    {isFullyPaid ? (
                      <div className="mt-4 bg-green-600/20 border border-green-500/30 rounded-xl p-3 text-center">
                        <p className="text-green-400 font-semibold">✅ Dívida Quitada!</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-400 mb-3">
                          Faltam <span className="font-semibold text-red-400">{formatCurrency(remaining)}</span> para quitar
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-red-600 hover:bg-red-700" 
                            size="sm"
                            onClick={() => {
                              setSelectedDebt(debt);
                              setShowPayDebtModal(true);
                            }}
                          >
                            Pagar
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="flex-1" 
                            size="sm"
                            onClick={() => {
                              setSelectedDebt(debt);
                              setShowDebtDetailsModal(true);
                            }}
                          >
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Modal Adicionar Dinheiro */}
      {showAddMoneyModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Adicionar à Meta</CardTitle>
              <button
                onClick={() => {
                  setShowAddMoneyModal(false);
                  setSelectedGoal(null);
                  setAmount('');
                }}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-600/20 rounded-xl p-4 border border-amber-500/30">
                <p className="text-sm text-gray-400">Meta</p>
                <p className="text-lg font-bold text-white">{selectedGoal.title}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Faltam {formatCurrency(selectedGoal.target - selectedGoal.current)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Quanto deseja adicionar?</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                    className="pl-12 text-lg font-semibold"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setShowAddMoneyModal(false);
                    setSelectedGoal(null);
                    setAmount('');
                  }}
                  variant="secondary" 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddMoney} className="flex-1" disabled={!amount}>
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Nova Meta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Nova Meta</CardTitle>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewGoal({ title: '', target: '', icon: 'target' });
                }}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nome da Meta</label>
                <Input
                  placeholder="Ex: Viagem, Celular novo..."
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor da Meta</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    placeholder="0,00"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: formatAmountInput(e.target.value) })}
                    className="pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Ícone</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'target', icon: Target, label: 'Alvo' },
                    { id: 'shield', icon: Shield, label: 'Proteção' },
                    { id: 'plane', icon: Plane, label: 'Viagem' },
                  ].map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setNewGoal({ ...newGoal, icon: option.id })}
                        className={`p-4 rounded-xl border transition-all ${
                          newGoal.icon === option.id
                            ? 'bg-amber-600/20 border-amber-500/50'
                            : 'bg-[hsl(var(--secondary))] border-[hsl(var(--border))] hover:border-amber-500/30'
                        }`}
                      >
                        <OptionIcon className="w-6 h-6 mx-auto mb-1 text-amber-400" />
                        <p className="text-xs text-gray-400">{option.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setShowAddModal(false);
                    setNewGoal({ title: '', target: '', icon: 'target' });
                  }}
                  variant="secondary" 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateGoal} 
                  className="flex-1"
                  disabled={!newGoal.title || !newGoal.target}
                >
                  Criar Meta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Adicionar Dívida */}
      {showAddDebtModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Nova Dívida</CardTitle>
              <button
                onClick={() => {
                  setShowAddDebtModal(false);
                  setNewDebt({ title: '', total: '', creditor: '', installments: '1' });
                }}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nome da Dívida</label>
                <Input
                  placeholder="Ex: Cartão de crédito, Empréstimo..."
                  value={newDebt.title}
                  onChange={(e) => setNewDebt({ ...newDebt, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor Total</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    placeholder="0,00"
                    value={newDebt.total}
                    onChange={(e) => setNewDebt({ ...newDebt, total: formatAmountInput(e.target.value) })}
                    className="pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Credor (opcional)</label>
                <Input
                  placeholder="Ex: Banco, Loja..."
                  value={newDebt.creditor}
                  onChange={(e) => setNewDebt({ ...newDebt, creditor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Número de Parcelas</label>
                <Input
                  type="number"
                  placeholder="1"
                  min="1"
                  max="240"
                  value={newDebt.installments}
                  onChange={(e) => setNewDebt({ ...newDebt, installments: e.target.value })}
                />
                {newDebt.total && newDebt.installments && parseInt(newDebt.installments) > 0 && (
                  <p className="text-xs text-amber-400 mt-2">
                    {parseInt(newDebt.installments)}x de {formatCurrency(
                      parseFloat(newDebt.total.replace(/[^0-9,]/g, '').replace(',', '.')) / parseInt(newDebt.installments)
                    )}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setShowAddDebtModal(false);
                    setNewDebt({ title: '', total: '', creditor: '', installments: '1' });
                  }}
                  variant="secondary" 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateDebt} 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!newDebt.title || !newDebt.total}
                >
                  Adicionar Dívida
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Pagar Dívida */}
      {showPayDebtModal && selectedDebt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Pagar Dívida</CardTitle>
              <button
                onClick={() => {
                  setShowPayDebtModal(false);
                  setSelectedDebt(null);
                  setAmount('');
                }}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-gray-400">Dívida</p>
                <p className="text-lg font-bold text-white">{selectedDebt.title}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Faltam {formatCurrency(selectedDebt.total - selectedDebt.paid)}
                </p>
                {selectedDebt.installments > 1 && (
                  <p className="text-xs text-amber-400 mt-1">
                    Parcela: {formatCurrency(selectedDebt.installmentValue)}/mês
                  </p>
                )}
              </div>

              {/* Opções rápidas de pagamento */}
              {selectedDebt.installments > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Opções de Pagamento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handlePayDebt('installment')}
                      className="bg-orange-600 hover:bg-orange-700 h-auto py-3 flex flex-col items-center"
                    >
                      <span className="text-xs mb-1">Parcela do mês</span>
                      <span className="font-bold">{formatCurrency(selectedDebt.installmentValue)}</span>
                    </Button>
                    <Button
                      onClick={() => handlePayDebt('full')}
                      className="bg-green-600 hover:bg-green-700 h-auto py-3 flex flex-col items-center"
                    >
                      <span className="text-xs mb-1">Quitar dívida</span>
                      <span className="font-bold">{formatCurrency(selectedDebt.total - selectedDebt.paid)}</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Pagamento customizado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {selectedDebt.installments > 1 ? 'Ou pagar outro valor' : 'Quanto deseja pagar?'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                    className="pl-12 text-lg font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setShowPayDebtModal(false);
                    setSelectedDebt(null);
                    setAmount('');
                  }}
                  variant="secondary" 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => handlePayDebt('custom')} 
                  className="flex-1 bg-red-600 hover:bg-red-700" 
                  disabled={!amount}
                >
                  Pagar Valor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Modal Detalhes da Meta */}
      {showGoalDetailsModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Detalhes da Meta</CardTitle>
              <button
                onClick={() => {
                  setShowGoalDetailsModal(false);
                  setSelectedGoal(null);
                }}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-600/20 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const Icon = iconMap[selectedGoal.icon] || Target;
                    return <Icon className="w-8 h-8 text-amber-400" />;
                  })()}
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedGoal.title}</h3>
                    <p className="text-sm text-gray-400">Meta de economia</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Valor atual</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(selectedGoal.current)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Meta</span>
                    <span className="text-lg font-bold text-amber-400">{formatCurrency(selectedGoal.target)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Falta para atingir</span>
                    <span className="text-lg font-bold text-orange-400">{formatCurrency(selectedGoal.target - selectedGoal.current)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-amber-500/30">
                    <span className="text-sm text-gray-400">Progresso</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {Math.round((selectedGoal.current / selectedGoal.target) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-3 overflow-hidden mt-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-orange-600"
                    style={{ width: `${Math.min((selectedGoal.current / selectedGoal.target) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <Button 
                onClick={() => {
                  setShowGoalDetailsModal(false);
                  setShowAddMoneyModal(true);
                }}
                className="w-full"
              >
                Adicionar Dinheiro
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Detalhes da Dívida */}
      {showDebtDetailsModal && selectedDebt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Detalhes da Dívida</CardTitle>
              <button
                onClick={() => {
                  setShowDebtDetailsModal(false);
                  setSelectedDebt(null);
                }}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedDebt.title}</h3>
                    <p className="text-sm text-gray-400">{selectedDebt.creditor}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Valor total</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(selectedDebt.total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Valor pago</span>
                    <span className="text-lg font-bold text-green-400">{formatCurrency(selectedDebt.paid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Falta pagar</span>
                    <span className="text-lg font-bold text-red-400">{formatCurrency(selectedDebt.total - selectedDebt.paid)}</span>
                  </div>
                  
                  {selectedDebt.installments > 1 && (
                    <>
                      <div className="border-t border-red-500/30 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Valor da parcela</span>
                          <span className="text-lg font-bold text-amber-400">{formatCurrency(selectedDebt.installmentValue)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Parcelas pagas</span>
                        <span className="text-lg font-bold text-white">
                          {Math.floor(selectedDebt.paid / selectedDebt.installmentValue)}/{selectedDebt.installments}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Parcelas restantes</span>
                        <span className="text-lg font-bold text-orange-400">
                          {selectedDebt.installments - Math.floor(selectedDebt.paid / selectedDebt.installmentValue)}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-red-500/30">
                    <span className="text-sm text-gray-400">Progresso</span>
                    <span className="text-2xl font-bold text-red-400">
                      {Math.round((selectedDebt.paid / selectedDebt.total) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-3 overflow-hidden mt-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-600"
                    style={{ width: `${Math.min((selectedDebt.paid / selectedDebt.total) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <Button 
                onClick={() => {
                  setShowDebtDetailsModal(false);
                  setShowPayDebtModal(true);
                }}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Fazer Pagamento
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
