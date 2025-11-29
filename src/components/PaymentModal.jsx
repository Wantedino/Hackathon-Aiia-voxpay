import React, { useState } from 'react';
import { X, Smartphone, Barcode, Calendar, CreditCard, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui';
import { Button } from './ui';
import { Input } from './ui';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export default function PaymentModal({ onClose }) {
  const { addTransaction, balance } = useApp();
  const { showToast } = useToast();
  const [paymentType, setPaymentType] = useState('barcode'); // 'barcode' ou 'bill'
  const [step, setStep] = useState('input'); // 'input', 'confirm', 'success'
  const [barcode, setBarcode] = useState('');
  const [billData, setBillData] = useState({
    description: '',
    value: '',
    dueDate: '',
  });

  const formatCurrency = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValueChange = (value) => {
    const formatted = formatCurrency(value);
    setBillData({ ...billData, value: formatted });
  };

  const handleBarcodeChange = (value) => {
    // Remove não-números e limita a 47 dígitos (código de barras padrão)
    const numbers = value.replace(/\D/g, '').slice(0, 47);
    setBarcode(numbers);
  };

  const parseValue = () => {
    const value = billData.value.replace(/\./g, '').replace(',', '.');
    return parseFloat(value);
  };

  const handleConfirmPayment = () => {
    if (paymentType === 'barcode') {
      if (barcode.length < 44) {
        showToast({
          title: 'Código inválido',
          message: 'Digite um código de barras válido',
          type: 'error',
        });
        return;
      }
      // Simula leitura do boleto
      setBillData({
        description: 'Conta de Luz',
        value: '150,00',
        dueDate: '30/11/2025',
      });
      setStep('confirm');
    } else {
      if (!billData.description || !billData.value || !billData.dueDate) {
        showToast({
          title: 'Dados incompletos',
          message: 'Preencha todos os campos',
          type: 'error',
        });
        return;
      }
      setStep('confirm');
    }
  };

  const handleProcessPayment = () => {
    const amount = parseValue();
    
    if (amount > balance) {
      showToast({
        title: 'Saldo insuficiente',
        message: 'Você não tem saldo suficiente para este pagamento',
        type: 'error',
      });
      return;
    }

    // Adiciona a transação
    addTransaction({
      title: billData.description,
      amount: -amount,
      type: 'expense',
      category: 'bills',
    });

    setStep('success');

    showToast({
      title: 'Pagamento realizado!',
      message: `${billData.description} pago com sucesso`,
      type: 'success',
    });

    // Fecha o modal após 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Pagamentos</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'input' && (
            <div className="space-y-6">
              {/* Tipo de Pagamento */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentType('barcode')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentType === 'barcode'
                      ? 'border-amber-500 bg-amber-600/20'
                      : 'border-gray-600 bg-[hsl(var(--card))] hover:border-gray-500'
                  }`}
                >
                  <Barcode className={`w-6 h-6 mx-auto mb-2 ${
                    paymentType === 'barcode' ? 'text-amber-400' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    paymentType === 'barcode' ? 'text-amber-400' : 'text-gray-400'
                  }`}>
                    Código de Barras
                  </p>
                </button>

                <button
                  onClick={() => setPaymentType('bill')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentType === 'bill'
                      ? 'border-amber-500 bg-amber-600/20'
                      : 'border-gray-600 bg-[hsl(var(--card))] hover:border-gray-500'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                    paymentType === 'bill' ? 'text-amber-400' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    paymentType === 'bill' ? 'text-amber-400' : 'text-gray-400'
                  }`}>
                    Manual
                  </p>
                </button>
              </div>

              {/* Input de Código de Barras */}
              {paymentType === 'barcode' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Código de Barras</label>
                  <Input
                    type="text"
                    placeholder="Digite ou cole o código"
                    value={barcode}
                    onChange={(e) => handleBarcodeChange(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    {barcode.length}/47 dígitos
                  </p>
                </div>
              )}

              {/* Inputs Manuais */}
              {paymentType === 'bill' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Descrição</label>
                    <Input
                      type="text"
                      placeholder="Ex: Conta de Luz"
                      value={billData.description}
                      onChange={(e) => setBillData({ ...billData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Valor</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                      <Input
                        type="text"
                        placeholder="0,00"
                        value={billData.value}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Vencimento</label>
                    <Input
                      type="date"
                      value={billData.dueDate}
                      onChange={(e) => setBillData({ ...billData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Botão Continuar */}
              <Button
                onClick={handleConfirmPayment}
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={
                  (paymentType === 'barcode' && barcode.length < 44) ||
                  (paymentType === 'bill' && (!billData.description || !billData.value || !billData.dueDate))
                }
              >
                Continuar
              </Button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              {/* Resumo do Pagamento */}
              <div className="bg-[hsl(var(--secondary))] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{billData.description}</h3>
                    <p className="text-sm text-gray-400">Pagamento de conta</p>
                  </div>
                </div>

                <div className="h-px bg-gray-700" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Valor</span>
                    <span className="font-semibold text-white">R$ {billData.value}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Vencimento</span>
                    <span className="text-white">{billData.dueDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Saldo disponível</span>
                    <span className="text-white">
                      R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aviso de Saldo */}
              {parseValue() > balance && (
                <div className="flex items-start gap-2 p-3 bg-red-600/10 border border-red-500/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Saldo insuficiente</p>
                    <p className="text-xs text-red-400/80">Você não tem saldo suficiente para este pagamento</p>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('input')}
                  variant="secondary"
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  disabled={parseValue() > balance}
                >
                  Pagar
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 py-8 text-center">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Pagamento realizado!</h3>
                <p className="text-gray-400">
                  {billData.description} foi pago com sucesso
                </p>
              </div>
              <div className="bg-[hsl(var(--secondary))] rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Valor pago</p>
                <p className="text-2xl font-bold text-white">R$ {billData.value}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
