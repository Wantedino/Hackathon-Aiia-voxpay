import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui';
import { TrendingUp, TrendingDown, Search, ArrowUpRight, ArrowDownRight, Bitcoin, Coins, X } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';

// Ícones SVG das criptomoedas
const CryptoIcons = {
  BTC: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" fill="white"/>
    </svg>
  ),
  ETH: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <path d="M16.498 4v8.87l7.497 3.35z" fill="white" fillOpacity="0.602"/>
      <path d="M16.498 4L9 16.22l7.498-3.35z" fill="white"/>
      <path d="M16.498 21.968v6.027L24 17.616z" fill="white" fillOpacity="0.602"/>
      <path d="M16.498 27.995v-6.028L9 17.616z" fill="white"/>
      <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="white" fillOpacity="0.2"/>
      <path d="M9 16.22l7.498 4.353v-7.701z" fill="white" fillOpacity="0.602"/>
    </svg>
  ),
  BNB: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
      <path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z" fill="white"/>
    </svg>
  ),
  SOL: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <defs>
        <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFA3"/>
          <stop offset="100%" stopColor="#DC1FFF"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#solGradient)"/>
      <path d="M9.8 19.5c.2-.2.5-.3.8-.3h14.8c.5 0 .8.6.5 1l-2.4 2.4c-.2.2-.5.3-.8.3H7.9c-.5 0-.8-.6-.5-1l2.4-2.4zm0-11c.2-.2.5-.3.8-.3h14.8c.5 0 .8.6.5 1l-2.4 2.4c-.2.2-.5.3-.8.3H7.9c-.5 0-.8-.6-.5-1l2.4-2.4zm12.8 5.5c.2-.2.5-.3.8-.3h2.5c.5 0 .8.6.5 1l-2.4 2.4c-.2.2-.5.3-.8.3H7.9c-.5 0-.8-.6-.5-1l2.4-2.4c.2-.2.5-.3.8-.3h11.2z" fill="white"/>
    </svg>
  ),
  XRP: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#23292F"/>
      <path d="M22.8 7h2.7l-5.9 5.9c-1.6 1.6-4.2 1.6-5.8 0L7.9 7h2.7l4.4 4.4c1 1 2.6 1 3.6 0L22.8 7zM9.2 25H6.5l5.9-5.9c1.6-1.6 4.2-1.6 5.8 0l5.9 5.9h-2.7l-4.4-4.4c-1-1-2.6-1-3.6 0L9.2 25z" fill="white"/>
    </svg>
  ),
  ADA: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#0033AD"/>
      <path d="M16 11.5c.8 0 1.5-.7 1.5-1.5S16.8 8.5 16 8.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-5.2.3c.6 0 1.1-.5 1.1-1.1s-.5-1.1-1.1-1.1-1.1.5-1.1 1.1.5 1.1 1.1 1.1zm10.4 0c.6 0 1.1-.5 1.1-1.1s-.5-1.1-1.1-1.1-1.1.5-1.1 1.1.5 1.1 1.1 1.1zm-13.5 5c.8 0 1.5-.7 1.5-1.5S8.5 14 7.7 14s-1.5.7-1.5 1.5.7 1.3 1.5 1.3zm16.6 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-13.5 5.5c.6 0 1.1-.5 1.1-1.1s-.5-1.1-1.1-1.1-1.1.5-1.1 1.1.5 1.1 1.1 1.1zm10.4 0c.6 0 1.1-.5 1.1-1.1s-.5-1.1-1.1-1.1-1.1.5-1.1 1.1.5 1.1 1.1 1.1zM16 23.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm0-6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="white"/>
    </svg>
  ),
  DOGE: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#C3A634"/>
      <path d="M14.4 9.1h4.6c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4.6V9.1zm0 2.5v7h4.6c1.9 0 3.5-1.6 3.5-3.5s-1.6-3.5-3.5-3.5h-4.6zM7 14.1h4.9v2.5H7v-2.5z" fill="white"/>
    </svg>
  ),
  AVAX: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#E84142"/>
      <path d="M18.8 10.5c.7-1.2 1.8-1.2 2.5 0l6.4 11c.7 1.2.1 2.2-1.2 2.2h-13c-1.4 0-2-1-1.2-2.2l6.5-11zM9.3 23.7h4.6c1.4 0 2-1 1.2-2.2l-2.3-4c-.7-1.2-1.8-1.2-2.5 0l-2.3 4c-.7 1.2-.1 2.2 1.3 2.2z" fill="white"/>
    </svg>
  ),
  DOT: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#E6007A"/>
      <circle cx="16" cy="16" r="5" fill="white"/>
      <circle cx="16" cy="7" r="2.5" fill="white"/>
      <circle cx="16" cy="25" r="2.5" fill="white"/>
      <circle cx="7" cy="16" r="2.5" fill="white"/>
      <circle cx="25" cy="16" r="2.5" fill="white"/>
    </svg>
  ),
  MATIC: () => (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="16" r="16" fill="#8247E5"/>
      <path d="M21.3 11.8c-.4-.2-.9-.2-1.3 0l-3.2 1.9-2.1 1.2-3.2 1.9c-.4.2-.9.2-1.3 0l-2.5-1.5c-.4-.2-.6-.6-.6-1v-3c0-.4.2-.8.6-1l2.5-1.5c.4-.2.9-.2 1.3 0l2.5 1.5c.4.2.6.6.6 1v1.9l2.1-1.2v-1.9c0-.4-.2-.8-.6-1l-4.5-2.7c-.4-.2-.9-.2-1.3 0L5.6 9.1c-.4.2-.6.6-.6 1v5.4c0 .4.2.8.6 1l4.6 2.7c.4.2.9.2 1.3 0l3.2-1.9 2.1-1.2 3.2-1.9c.4-.2.9-.2 1.3 0l2.5 1.5c.4.2.6.6.6 1v3c0 .4-.2.8-.6 1l-2.5 1.5c-.4.2-.9.2-1.3 0l-2.5-1.5c-.4-.2-.6-.6-.6-1v-1.9l-2.1 1.2v1.9c0 .4.2.8.6 1l4.6 2.7c.4.2.9.2 1.3 0l4.6-2.7c.4-.2.6-.6.6-1v-5.4c0-.4-.2-.8-.6-1l-4.7-2.7z" fill="white"/>
    </svg>
  ),
};

// Preços reais aproximados das criptomoedas (em USD e BRL)
const cryptoData = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    priceUSD: 96840.50,
    priceBRL: 483202.50,
    change24h: 2.45,
    color: 'orange',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    priceUSD: 3621.75,
    priceBRL: 18108.75,
    change24h: -1.23,
    color: 'blue',
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    priceUSD: 695.30,
    priceBRL: 3476.50,
    change24h: 3.87,
    color: 'yellow',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    priceUSD: 238.90,
    priceBRL: 1194.50,
    change24h: 5.12,
    color: 'purple',
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRP',
    priceUSD: 1.42,
    priceBRL: 7.10,
    change24h: -0.85,
    color: 'gray',
  },
  {
    id: 'ada',
    name: 'Cardano',
    symbol: 'ADA',
    priceUSD: 1.05,
    priceBRL: 5.25,
    change24h: 1.76,
    color: 'blue',
  },
  {
    id: 'doge',
    name: 'Dogecoin',
    symbol: 'DOGE',
    priceUSD: 0.38,
    priceBRL: 1.90,
    change24h: 8.45,
    color: 'yellow',
  },
  {
    id: 'avax',
    name: 'Avalanche',
    symbol: 'AVAX',
    priceUSD: 42.15,
    priceBRL: 210.75,
    change24h: -2.34,
    color: 'red',
  },
  {
    id: 'dot',
    name: 'Polkadot',
    symbol: 'DOT',
    priceUSD: 7.85,
    priceBRL: 39.25,
    change24h: 2.15,
    color: 'pink',
  },
  {
    id: 'matic',
    name: 'Polygon',
    symbol: 'MATIC',
    priceUSD: 0.52,
    priceBRL: 2.60,
    change24h: -1.45,
    color: 'purple',
  },
];

export default function CryptoScreen() {
  const { showToast } = useToast();
  const { balance, updateBalance } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [tradeType, setTradeType] = useState('buy'); // 'buy' ou 'sell'
  const [amount, setAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');

  const filteredCryptos = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmountInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const num = parseFloat(numbers) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatCryptoAmount = (value) => {
    const cleanValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    return cleanValue;
  };

  const handleOpenTrade = (crypto, type) => {
    setSelectedCrypto(crypto);
    setTradeType(type);
    setShowTradeModal(true);
    setAmount('');
    setCryptoAmount('');
  };

  const handleAmountChange = (value) => {
    const formatted = formatAmountInput(value);
    setAmount(formatted);
    
    if (selectedCrypto && formatted) {
      const brlValue = parseFloat(formatted.replace(/\./g, '').replace(',', '.'));
      const cryptoValue = brlValue / selectedCrypto.priceBRL;
      setCryptoAmount(cryptoValue.toFixed(8));
    } else {
      setCryptoAmount('');
    }
  };

  const handleCryptoAmountChange = (value) => {
    const formatted = formatCryptoAmount(value);
    setCryptoAmount(formatted);
    
    if (selectedCrypto && formatted) {
      const cryptoValue = parseFloat(formatted);
      const brlValue = cryptoValue * selectedCrypto.priceBRL;
      setAmount(brlValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } else {
      setAmount('');
    }
  };

  const handleTrade = () => {
    if (!amount || !cryptoAmount || !selectedCrypto) return;

    const brlValue = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(brlValue) || brlValue <= 0) {
      showToast({ title: 'Erro', message: 'Valor inválido', type: 'error' });
      return;
    }

    if (tradeType === 'buy') {
      // Comprar cripto
      if (balance < brlValue) {
        showToast({ title: 'Saldo insuficiente', message: 'Você não tem saldo suficiente para essa compra.', type: 'error' });
        return;
      }
      
      updateBalance(-brlValue);
      showToast({
        title: 'Compra realizada!',
        message: `Você comprou ${cryptoAmount} ${selectedCrypto.symbol} por ${formatCurrency(brlValue)}`,
        type: 'success'
      });
    } else {
      // Vender cripto (simulado - adiciona saldo)
      updateBalance(brlValue);
      showToast({
        title: 'Venda realizada!',
        message: `Você vendeu ${cryptoAmount} ${selectedCrypto.symbol} por ${formatCurrency(brlValue)}`,
        type: 'success'
      });
    }

    setShowTradeModal(false);
    setAmount('');
    setCryptoAmount('');
    setSelectedCrypto(null);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Criptomoedas</h2>
        <p className="text-sm text-gray-400">Compre e venda as principais criptos do mercado</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Buscar criptomoeda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Market Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">Mercado 24h</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Em alta</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-green-400">
                  {cryptoData.filter(c => c.change24h > 0).length} moedas
                </span>
              </div>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Em queda</p>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">
                  {cryptoData.filter(c => c.change24h < 0).length} moedas
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crypto List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Criptomoedas Disponíveis
        </h3>
        {filteredCryptos.map((crypto) => {
          const isPositive = crypto.change24h > 0;
          const IconComponent = CryptoIcons[crypto.symbol];
          return (
            <Card key={crypto.id} className="hover:bg-[hsl(var(--card))]/80 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                      <IconComponent />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{crypto.name}</h4>
                      <p className="text-sm text-gray-400">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{formatCurrency(crypto.priceBRL)}</p>
                    <div className={`flex items-center gap-1 justify-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {Math.abs(crypto.change24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Buy/Sell Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleOpenTrade(crypto, 'buy')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Comprar
                  </Button>
                  <Button
                    onClick={() => handleOpenTrade(crypto, 'sell')}
                    variant="secondary"
                    className="flex-1"
                    size="sm"
                  >
                    Vender
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trade Modal */}
      {showTradeModal && selectedCrypto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>
                {tradeType === 'buy' ? 'Comprar' : 'Vender'} {selectedCrypto.symbol}
              </CardTitle>
              <button
                onClick={() => {
                  setShowTradeModal(false);
                  setSelectedCrypto(null);
                  setAmount('');
                  setCryptoAmount('');
                }}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Crypto Info */}
              <div className={`border rounded-xl p-4 ${tradeType === 'buy' ? 'bg-green-600/10 border-green-500/30' : 'bg-orange-600/10 border-orange-500/30'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center">
                    {(() => {
                      const IconComponent = CryptoIcons[selectedCrypto.symbol];
                      return <IconComponent />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedCrypto.name}</h3>
                    <p className="text-sm text-gray-400">{selectedCrypto.symbol}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Preço atual</span>
                  <span className="font-bold text-white">{formatCurrency(selectedCrypto.priceBRL)}</span>
                </div>
              </div>

              {/* Amount Input (BRL) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Valor em Reais
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pl-12 text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Crypto Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Quantidade de {selectedCrypto.symbol}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{selectedCrypto.symbol}</span>
                  <Input
                    placeholder="0.00000000"
                    value={cryptoAmount}
                    onChange={(e) => handleCryptoAmountChange(e.target.value)}
                    className="pl-16 text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Summary */}
              {amount && cryptoAmount && (
                <div className="bg-[hsl(var(--secondary))] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Você {tradeType === 'buy' ? 'paga' : 'recebe'}</span>
                    <span className="font-bold text-white">{formatCurrency(parseFloat(amount.replace(/\./g, '').replace(',', '.')))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Você {tradeType === 'buy' ? 'recebe' : 'vende'}</span>
                    <span className="font-bold text-purple-400">{cryptoAmount} {selectedCrypto.symbol}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowTradeModal(false);
                    setSelectedCrypto(null);
                    setAmount('');
                    setCryptoAmount('');
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleTrade}
                  className={`flex-1 ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                  disabled={!amount || !cryptoAmount}
                >
                  Confirmar {tradeType === 'buy' ? 'Compra' : 'Venda'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
