import React, { useState } from 'react';
import { Card, CardContent, Button } from './ui';
import { Copy, Eye, EyeOff, Lock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const mockCards = [
  {
    id: 1,
    type: 'Débito virtual',
    provider: 'Mercado Pago',
    network: 'VISA',
    lastDigits: '4818',
    fullNumber: '4532 1234 5678 4818',
    cvv: '123',
    expiry: '12/28',
    color: 'from-blue-900 to-cyan-700',
    isVirtual: true,
  },
  {
    id: 2,
    type: 'Crédito',
    provider: 'Mastercard',
    network: 'MASTERCARD',
    lastDigits: '7362',
    fullNumber: '5412 7534 8876 7362',
    cvv: '456',
    expiry: '08/27',
    color: 'from-purple-900 to-violet-700',
    isVirtual: false,
  },
];

export default function CardsScreen() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const { showToast } = useToast();

  const currentCard = mockCards[currentCardIndex];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentCard.fullNumber.replace(/\s/g, ''));
    showToast({ 
      title: 'Copiado!', 
      message: 'Número do cartão copiado para a área de transferência', 
      type: 'success' 
    });
  };

  const handleBlockCard = () => {
    showToast({ 
      title: 'Cartão bloqueado', 
      message: 'Seu cartão foi bloqueado temporariamente', 
      type: 'info' 
    });
  };

  const handleCancelCard = () => {
    showToast({ 
      title: 'Cancelamento solicitado', 
      message: 'A solicitação de cancelamento foi enviada', 
      type: 'info' 
    });
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % mockCards.length);
    setShowDetails(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + mockCards.length) % mockCards.length);
    setShowDetails(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Cartões</h2>
        <p className="text-sm text-gray-400 mt-1">Gerencie seus cartões virtuais e físicos</p>
      </div>

      {/* Card Display com Slider */}
      <div className="relative">
        <div className="relative flex items-center justify-center">
          {/* Botão Anterior */}
          {mockCards.length > 1 && (
            <button
              onClick={prevCard}
              className="absolute left-0 z-10 p-2 bg-[hsl(var(--card))] rounded-full hover:bg-[hsl(var(--secondary))] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}

          {/* Cartão 3D */}
          <div className="w-full max-w-sm mx-8">
            <div 
              className={`relative w-full aspect-[1.586] bg-gradient-to-br ${currentCard.color} rounded-2xl shadow-2xl p-6 flex flex-col justify-between transform transition-all duration-300 hover:scale-105`}
              style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
              }}
            >
              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium">
                  {currentCard.type}
                </div>
                <div className="text-white text-xs font-bold tracking-wider">
                  {currentCard.network}
                </div>
              </div>

              {/* Middle Section - Chip */}
              <div className="flex items-center">
                <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md flex items-center justify-center">
                  <div className="w-8 h-6 border-2 border-yellow-700/30 rounded-sm"></div>
                </div>
              </div>

              {/* Bottom Section */}
              <div>
                <div className="text-white text-lg font-mono tracking-wider mb-3">
                  {showDetails ? currentCard.fullNumber : `•••• ${currentCard.lastDigits}`}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-white/80 text-xs">
                    <div className="text-white/60 text-[10px]">Validade</div>
                    <div className="font-medium">{showDetails ? currentCard.expiry : '••/••'}</div>
                  </div>
                  <div className="text-white/80 text-xs">
                    <div className="text-white/60 text-[10px]">CVV</div>
                    <div className="font-medium">{showDetails ? currentCard.cvv : '•••'}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
                    <svg viewBox="0 0 48 48" className="w-8 h-8 text-white/90">
                      <path fill="currentColor" d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 28c-6.627 0-12-5.373-12-12S17.373 12 24 12s12 5.373 12 12-5.373 12-12 12z"/>
                      <path fill="currentColor" d="M20 18h8v4h-8zm0 8h8v4h-8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Próximo */}
          {mockCards.length > 1 && (
            <button
              onClick={nextCard}
              className="absolute right-0 z-10 p-2 bg-[hsl(var(--card))] rounded-full hover:bg-[hsl(var(--secondary))] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Indicadores de Cartão */}
        {mockCards.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {mockCards.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentCardIndex 
                    ? 'w-8 bg-purple-500' 
                    : 'w-1.5 bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">{currentCard.type}</h3>
              <p className="text-sm text-gray-400">{currentCard.provider}</p>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
            >
              {showDetails ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Número do Cartão */}
          <div className="bg-[hsl(var(--secondary))] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Número do cartão</p>
                <p className="text-lg font-mono text-white">
                  {showDetails ? currentCard.fullNumber : `•••• ${currentCard.lastDigits}`}
                </p>
              </div>
              <button
                onClick={handleCopyNumber}
                className="p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <button
              onClick={handleBlockCard}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-xl transition-all"
            >
              <Lock className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Bloquear cartão</span>
            </button>
            <button
              onClick={handleCancelCard}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 rounded-xl transition-all"
            >
              <XCircle className="w-6 h-6 text-red-400" />
              <span className="text-sm font-medium text-red-300">Cancelar e criar novo</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold text-white mb-3">Informações</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))]">
              <span className="text-sm text-gray-400">Tipo de cartão</span>
              <span className="text-sm text-white font-medium">
                {currentCard.isVirtual ? 'Virtual' : 'Físico'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))]">
              <span className="text-sm text-gray-400">Bandeira</span>
              <span className="text-sm text-white font-medium">{currentCard.network}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-400">Status</span>
              <span className="text-sm text-green-400 font-medium">Ativo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request New Card Button */}
      <Button 
        className="w-full"
        onClick={() => showToast({ 
          title: 'Novo cartão', 
          message: 'Solicitação de novo cartão enviada com sucesso', 
          type: 'success' 
        })}
      >
        Solicitar novo cartão
      </Button>
    </div>
  );
}
