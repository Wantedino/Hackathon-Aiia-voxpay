import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';
import { ArrowRightLeft, Gift, Shield, Landmark, CreditCard, PiggyBank, Settings, X, Check, ShoppingBag, Tags, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

const allAvailableActions = [
  {
    id: 'pix',
    icon: ArrowRightLeft,
    label: 'PIX',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'cashback',
    icon: Gift,
    label: 'Cashback',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'shop',
    icon: ShoppingBag,
    label: 'Shopping',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'giftcard',
    icon: Tags,
    label: 'Gift Cards',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'recharge',
    icon: Phone,
    label: 'Recargas',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'insurance',
    icon: Shield,
    label: 'Seguros',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'loan',
    icon: Landmark,
    label: 'Empréstimos',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'cards',
    icon: CreditCard,
    label: 'Cartões',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
  {
    id: 'investments',
    icon: PiggyBank,
    label: 'Investir',
    color: 'bg-gradient-to-br from-slate-800 to-slate-900 text-amber-500 border-slate-700/50 shadow-lg',
  },
];

export default function QuickActions({ onActionClick }) {
  const { quickActions, toggleQuickAction, darkMode } = useApp();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const enabledActions = allAvailableActions.filter(action => 
    quickActions.find(qa => qa.id === action.id && qa.enabled)
  );

  const handleToggleAction = (actionId) => {
    toggleQuickAction(actionId);
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ações Rápidas
          </h3>
          <button 
            onClick={() => setShowCustomizeModal(true)}
            className={`p-1.5 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-[hsl(var(--secondary))]' : 'hover:bg-gray-100'
            }`}
          >
            <Settings className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {enabledActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onActionClick(action.id)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${action.color}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium whitespace-nowrap">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal de Customização */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600/20 rounded-xl">
                  <Settings className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl">Personalizar Ações</CardTitle>
              </div>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-sm text-gray-300">
                  Selecione até <span className="font-semibold text-amber-400">6 ações rápidas</span> para exibir na tela inicial.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {quickActions.filter(a => a.enabled).length}/6 selecionadas
                </p>
              </div>

              <div className="space-y-2">
                {allAvailableActions.map((action) => {
                  const Icon = action.icon;
                  const isEnabled = quickActions.find(qa => qa.id === action.id)?.enabled || false;
                  
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleToggleAction(action.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        isEnabled 
                          ? 'bg-amber-600/20 border-amber-500/50' 
                          : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] hover:border-amber-500/30'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${action.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">{action.label}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isEnabled 
                          ? 'bg-amber-600 border-amber-600' 
                          : 'border-gray-600'
                      }`}>
                        {isEnabled && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button onClick={() => setShowCustomizeModal(false)} className="w-full">
                Concluído
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
