import React from 'react';
import { Card, CardHeader, CardTitle } from './ui';
import { useApp } from '../context/AppContext';
import { User } from 'lucide-react';

export default function WelcomeCard({ onProfileClick }) {
  const { user, darkMode } = useApp();

  return (
    <Card className={`transition-colors ${
      darkMode 
        ? 'bg-slate-800/50 border border-slate-700/50' 
        : 'bg-white border border-gray-200'
    }`}>
      <CardHeader className="pb-4">
        <div>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Bem-vindo de volta,</p>
          <button 
            onClick={onProfileClick}
            className="text-left hover:opacity-80 transition-opacity flex items-center gap-2 mt-1"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <User className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`} />
            </div>
            <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {user.name}
            </CardTitle>
          </button>
        </div>
      </CardHeader>
    </Card>
  );
}
