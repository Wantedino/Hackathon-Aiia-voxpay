import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui';
import { useApp } from '../context/AppContext';
import { User, Bell, Lock, HelpCircle, LogOut, ChevronRight, ChevronLeft, X, Edit, Moon, Sun } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ProfileScreen({ onBack }) {
  const { user, setUser, notifications, markNotificationAsRead, darkMode, toggleDarkMode } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  const { showToast } = useToast();

  const menuItems = [
    { 
      icon: Bell, 
      label: 'Notificações', 
      badge: notifications.filter(n => !n.read).length.toString(),
      onClick: () => setShowNotifications(true)
    },
    { icon: Lock, label: 'Segurança', onClick: () => showToast({ title: 'Segurança', message: 'Configurações de Segurança', type: 'info' }) },
    { icon: HelpCircle, label: 'Ajuda', onClick: () => showToast({ title: 'Ajuda', message: 'Central de Ajuda', type: 'info' }) },
    { icon: LogOut, label: 'Sair', danger: true, onClick: () => showToast({ title: 'Sair', message: 'Saindo...', type: 'info' }) },
  ];

  const handleSaveProfile = () => {
    setUser({ ...user, name: editedName });
    setShowEditProfile(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-[hsl(var(--secondary))]' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Perfil</h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gerencie sua conta</p>
        </div>
      </div>

      {/* User Info Card */}
      <Card className={`transition-colors ${
        darkMode 
          ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode 
                ? 'bg-gradient-to-br from-amber-600 to-orange-600' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                erick.mendonca@email.com
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setShowEditProfile(true)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Menu */}
      <div className="space-y-2">
        {/* Dark Mode Toggle */}
        <div className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
          darkMode ? 'bg-[hsl(var(--card))]' : 'bg-white border border-gray-200'
        }`}>
          <div className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-yellow-400'}`}>
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <span className={`flex-1 text-left font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {darkMode ? 'Modo Escuro' : 'Modo Claro'}
          </span>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              darkMode ? 'bg-blue-600' : 'bg-yellow-500'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-lg ${
                darkMode ? 'left-1' : 'left-7'
              }`}
            />
          </button>
        </div>

        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                darkMode 
                  ? 'bg-[hsl(var(--card))] hover:bg-[hsl(var(--secondary))]' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              } ${
                item.danger 
                  ? 'text-red-400' 
                  : darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && parseInt(item.badge) > 0 && (
                <span className={`px-2 py-1 text-white text-xs font-semibold rounded-full ${
                  darkMode ? 'bg-amber-600' : 'bg-blue-600'
                }`}>
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          );
        })}
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500 pt-6">
        <p>VOX<span className="text-amber-500">PAY</span> v1.0.0</p>
        <p className="mt-1">Hackathon MVP 2025</p>
      </div>

      {/* Modal Notificações */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Notificações</CardTitle>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                    notif.read
                      ? 'bg-[hsl(var(--muted))] border-[hsl(var(--border))]'
                      : 'bg-amber-600/10 border-amber-500/30 hover:bg-amber-600/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notif.read && (
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-2"></span>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-white">{notif.title}</p>
                      <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Editar Perfil */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Editar Perfil</CardTitle>
              <button
                onClick={() => setShowEditProfile(false)}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nome</label>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <Input value="erick.mendonca@email.com" disabled className="bg-[hsl(var(--muted))]" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowEditProfile(false)} variant="secondary" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSaveProfile} className="flex-1">
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
