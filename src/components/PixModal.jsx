import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui';
import { X, ArrowRightLeft, Copy, QrCode, Check, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../lib/utils';

export default function PixModal({ onClose }) {
  const { addTransaction, balance } = useApp();
  const { showToast } = useToast();
  const [step, setStep] = useState('options'); // options, send, receive, confirm, success
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText('erick.mendonca@email.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPix = () => {
    if (!pixKey || !amount) return;

    const value = parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.'));
    if (isNaN(value) || value <= 0) return;
    if (value > balance) {
      showToast({ title: 'Saldo insuficiente', message: 'Saldo insuficiente para enviar PIX.', type: 'error' });
      return;
    }

    addTransaction({
      title: `PIX para ${pixKey}`,
      amount: -value,
      type: 'expense',
      category: 'transfer',
    });

    setStep('success');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const formatAmountInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const num = parseFloat(numbers) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-lg animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/20 rounded-xl">
              <ArrowRightLeft className="w-6 h-6 text-amber-400" />
            </div>
            <CardTitle className="text-xl">Área PIX</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'options' && (
            <div className="space-y-3">
              <Button
                onClick={() => setStep('send')}
                className="w-full justify-start gap-3 h-14"
                variant="secondary"
              >
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <div className="font-medium">Transferir PIX</div>
                  <div className="text-xs text-gray-400">Enviar dinheiro</div>
                </div>
              </Button>
              <Button
                onClick={() => setStep('receive')}
                className="w-full justify-start gap-3 h-14"
                variant="secondary"
              >
                <QrCode className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <div className="font-medium">Receber PIX</div>
                  <div className="text-xs text-gray-400">Compartilhar chave ou QR Code</div>
                </div>
              </Button>
              <div className="bg-amber-600/10 rounded-xl p-4 border border-amber-500/20">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-amber-400">Saldo disponível:</span>{' '}
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          )}

          {step === 'send' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Chave PIX</label>
                <Input
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor</label>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Descrição (opcional)</label>
                <Input
                  placeholder="Ex: Almoço, Aluguel..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep('options')} variant="secondary" className="flex-1">
                  Voltar
                </Button>
                <Button 
                  onClick={handleSendPix} 
                  className="flex-1"
                  disabled={!pixKey || !amount}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 'receive' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-2xl">
                  <QrCode className="w-32 h-32 text-white" />
                </div>
              </div>
              <p className="text-center text-sm text-gray-400">
                Compartilhe este QR Code ou sua chave PIX
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Sua Chave PIX</label>
                <div className="flex gap-2">
                  <Input value="erick.mendonca@email.com" readOnly className="bg-[hsl(var(--muted))]" />
                  <Button variant="secondary" size="icon" onClick={handleCopyKey}>
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Chave copiada!
                  </p>
                )}
              </div>
              <Button onClick={() => setStep('options')} variant="secondary" className="w-full">
                Voltar
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">PIX Enviado!</h3>
                  <p className="text-gray-400 mt-1">Transferência realizada com sucesso</p>
                </div>
                <div className="bg-[hsl(var(--secondary))] rounded-xl p-4 w-full">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Valor transferido</p>
                    <p className="text-2xl font-bold text-white mt-1">R$ {amount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
