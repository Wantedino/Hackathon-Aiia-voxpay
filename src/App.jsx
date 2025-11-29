import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import BottomNav from './components/BottomNav';
import WelcomeCard from './components/WelcomeCard';
import BalanceCard from './components/BalanceCard';
import QuickActions from './components/QuickActions';
import TransactionList from './components/TransactionList';
import GoalsScreen from './components/GoalsScreen';
import ProfileScreen from './components/ProfileScreen';
import PixModal from './components/PixModal';
import CashbackModal from './components/CashbackModal';
import ServicesModal from './components/ServicesModal';
import PaymentModal from './components/PaymentModal';
import InvestmentsScreen from './components/InvestmentsScreen';
import CardsScreen from './components/CardsScreen';
import CryptoScreen from './components/CryptoScreen';
import AllFeaturesScreen from './components/AllFeaturesScreen';
import ShoppingScreen from './components/ShoppingScreen';
import GiftCardScreen from './components/GiftCardScreen';
import RechargeScreen from './components/RechargeScreen';
import AIAssistant from './components/AIAssistant';

function AppContent() {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const handleQuickAction = (actionId) => {
    if (actionId === 'pix') {
      setActiveModal('pix');
    } else if (actionId === 'cashback') {
      setActiveModal('cashback');
    } else if (actionId === 'shop') {
      setActiveTab('shop');
    } else if (actionId === 'giftcard') {
      setActiveTab('giftcard');
    } else if (actionId === 'recharge') {
      setActiveTab('recharge');
    } else if (actionId === 'cards') {
      setActiveTab('cards');
    } else if (actionId === 'investments') {
      // Navega para a aba de investimentos
      setActiveTab('investments');
    } else if (['insurance', 'loan'].includes(actionId)) {
      setActiveService(actionId);
      setActiveModal('services');
    }
  };

  const handleFeatureClick = (featureId) => {
    // Mapeia features para ações/abas
    const featureMapping = {
      'pix': () => setActiveModal('pix'),
      'cards': () => setActiveTab('cards'),
      'crypto': () => setActiveTab('crypto'),
      'investments': () => setActiveTab('investments'),
      'goals': () => setActiveTab('goals'),
      'debts': () => setActiveTab('goals'), // Abre aba de metas (que contém dívidas)
      'cashback': () => setActiveModal('cashback'),
      'payment': () => setActiveModal('payment'), // Abre modal de pagamentos
      'insurance': () => { setActiveService('insurance'); setActiveModal('services'); },
      'loan': () => { setActiveService('loan'); setActiveModal('services'); },
      'ai': () => setIsAIOpen(true), // Abre o chat do AI Assistant
      'extract': () => setActiveTab('home'), // Volta para home que tem transações
      'shop': () => setActiveTab('shop'), // Navega para Shopping
      'giftcard': () => setActiveTab('giftcard'), // Navega para Gift Cards
      'recharge': () => setActiveTab('recharge'), // Navega para Recargas
    };

    const action = featureMapping[featureId];
    if (action) {
      action();
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveService(null);
  };

  return (
    <div className={`min-h-screen pb-20 md:pb-0 md:pl-20 lg:pl-64 transition-colors ${
      darkMode 
        ? 'bg-[hsl(var(--background))]' 
        : 'bg-gray-50'
    }`}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 space-y-6 md:space-y-0">
            <div className="md:col-span-2 lg:col-span-2 space-y-6">
              <WelcomeCard onProfileClick={() => setActiveTab('profile')} />
              <BalanceCard />
              <div className="md:hidden">
                <QuickActions onActionClick={handleQuickAction} />
              </div>
              <TransactionList />
            </div>
            <div className="hidden md:block md:col-span-2 lg:col-span-1 space-y-6">
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="max-w-4xl mx-auto">
            <CardsScreen />
          </div>
        )}

        {activeTab === 'crypto' && (
          <div className="max-w-4xl mx-auto">
            <CryptoScreen />
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="max-w-4xl mx-auto">
            <InvestmentsScreen
              onOpenInvest={() => {
                setActiveService('investments');
                setActiveModal('services');
              }}
            />
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="max-w-4xl mx-auto">
            <GoalsScreen />
          </div>
        )}

        {activeTab === 'all' && (
          <div className="max-w-6xl mx-auto">
            <AllFeaturesScreen onFeatureClick={handleFeatureClick} />
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="max-w-6xl mx-auto">
            <ShoppingScreen onBack={() => setActiveTab('home')} />
          </div>
        )}

        {activeTab === 'giftcard' && (
          <div className="max-w-6xl mx-auto">
            <GiftCardScreen onBack={() => setActiveTab('home')} />
          </div>
        )}

        {activeTab === 'recharge' && (
          <div className="max-w-4xl mx-auto">
            <RechargeScreen onBack={() => setActiveTab('home')} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <ProfileScreen onBack={() => setActiveTab('home')} />
          </div>
        )}
      </div>

      {/* Bottom Navigation - Hidden on desktop */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* AI Assistant - Floating */}
      <AIAssistant isOpenExternal={isAIOpen} onOpenChange={setIsAIOpen} />

      {/* Modals */}
      {activeModal === 'pix' && <PixModal onClose={closeModal} />}
      {activeModal === 'cashback' && <CashbackModal onClose={closeModal} />}
      {activeModal === 'payment' && <PaymentModal onClose={closeModal} />}
      {activeModal === 'services' && (
        <ServicesModal serviceId={activeService} onClose={closeModal} />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
