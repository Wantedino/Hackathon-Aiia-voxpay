import React from 'react';
import { Home, CreditCard, PieChart, PiggyBank, Bitcoin, Grid3x3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'cards', icon: CreditCard, label: 'Cartões' },
  { id: 'crypto', icon: Bitcoin, label: 'Cripto' },
  { id: 'investments', icon: PiggyBank, label: 'Investir' },
  { id: 'goals', icon: PieChart, label: 'Metas' },
  { id: 'all', icon: Grid3x3, label: 'Todos' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  const { darkMode } = useApp();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t safe-bottom transition-colors z-40 ${
        darkMode 
          ? 'bg-[hsl(var(--card))] border-[hsl(var(--border))]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-lg mx-auto px-2">
          <div className="grid grid-cols-6 gap-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-all ${
                    isActive
                      ? darkMode 
                        ? 'text-slate-200 bg-slate-700/50' 
                        : 'text-blue-600 bg-blue-50'
                      : darkMode
                        ? 'text-slate-400 hover:text-slate-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className={`hidden md:block fixed left-0 top-0 bottom-0 w-20 lg:w-64 border-r transition-colors z-40 ${
        darkMode 
          ? 'bg-[hsl(var(--card))] border-[hsl(var(--border))]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 flex flex-col h-full">
          <div className="mb-8 lg:block hidden">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              VOX<span className="text-amber-500">PAY</span>
            </h1>
          </div>
          <div className="mb-8 lg:hidden flex justify-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-amber-600' : 'bg-blue-600'
            }`}>
              <span className="text-white font-bold text-xl">H</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? darkMode 
                        ? 'text-white bg-amber-600' 
                        : 'text-blue-600 bg-blue-50'
                      : darkMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium lg:block hidden">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
