import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui';
import { X, Gift, Star, ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useApp } from '../context/AppContext';

const cashbackOffers = [
  {
    id: 1,
    store: 'Magazine Luiza',
    cashback: 5,
    icon: ShoppingBag,
    color: 'text-blue-500',
    available: 125.50,
  },
  {
    id: 2,
    store: 'iFood',
    cashback: 10,
    icon: Gift,
    color: 'text-red-500',
    available: 48.20,
  },
  {
    id: 3,
    store: 'Uber',
    cashback: 3,
    icon: Star,
    color: 'text-green-500',
    available: 15.80,
  },
];

export default function CashbackModal({ onClose }) {
  const { addTransaction } = useApp();
  const [rescuedOffers, setRescuedOffers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastRescued, setLastRescued] = useState(null);

  const totalCashback = cashbackOffers
    .filter(o => !rescuedOffers.includes(o.id))
    .reduce((sum, offer) => sum + offer.available, 0);

  const handleRescue = (offer) => {
    addTransaction({
      title: `Cashback ${offer.store}`,
      amount: offer.available,
      type: 'income',
      category: 'cashback',
    });

    setRescuedOffers([...rescuedOffers, offer.id]);
    setLastRescued(offer);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setLastRescued(null);
    }, 2000);
  };

  const handleRescueAll = () => {
    const activeOffers = cashbackOffers.filter(o => !rescuedOffers.includes(o.id));
    
    activeOffers.forEach(offer => {
      addTransaction({
        title: `Cashback ${offer.store}`,
        amount: offer.available,
        type: 'income',
        category: 'cashback',
      });
    });

    setRescuedOffers(cashbackOffers.map(o => o.id));
    setLastRescued({ store: 'Total', available: totalCashback });
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-xl">
              <Gift className="w-6 h-6 text-green-400" />
            </div>
            <CardTitle className="text-xl">Cashback</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSuccess && lastRescued && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-400">Resgatado com sucesso!</p>
                  <p className="text-sm text-gray-300">
                    {formatCurrency(lastRescued.available)} adicionado à sua conta
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total disponível */}
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <p className="text-sm text-gray-400">Cashback Disponível</p>
            </div>
            <p className="text-3xl font-bold text-green-400 mb-4">{formatCurrency(totalCashback)}</p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleRescueAll}
              disabled={totalCashback === 0}
            >
              {totalCashback === 0 ? 'Tudo Resgatado!' : 'Resgatar Tudo'}
            </Button>
          </div>

          {/* Ofertas */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-400">Suas Ofertas</h4>
            {cashbackOffers.map((offer) => {
              const Icon = offer.icon;
              const isRescued = rescuedOffers.includes(offer.id);
              
              return (
                <div
                  key={offer.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isRescued 
                      ? 'bg-[hsl(var(--muted))] border-[hsl(var(--border))] opacity-50' 
                      : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] hover:border-green-500/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl bg-opacity-10 ${offer.color}`}>
                    <Icon className={`w-6 h-6 ${offer.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{offer.store}</p>
                    <p className="text-xs text-gray-400">{offer.cashback}% de cashback</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isRescued ? 'text-gray-500' : 'text-green-400'}`}>
                      {formatCurrency(offer.available)}
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-2 h-7 text-xs"
                      onClick={() => handleRescue(offer)}
                      disabled={isRescued}
                    >
                      {isRescued ? 'Resgatado' : 'Resgatar'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalCashback === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-400">🎉 Tudo resgatado! Continue comprando para ganhar mais cashback.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
