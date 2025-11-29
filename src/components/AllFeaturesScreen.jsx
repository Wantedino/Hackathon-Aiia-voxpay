import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from './ui';
import { 
  Banknote, 
  CreditCard, 
  PiggyBank, 
  Target, 
  TrendingUp, 
  Gift, 
  Shield, 
  Bitcoin,
  Smartphone,
  FileText,
  Lock,
  Zap,
  Percent,
  Receipt,
  MessageCircle,
  ShoppingBag,
  Tags,
  ChevronRight,
  Phone
} from 'lucide-react';

const features = [
  {
    id: 'pix',
    icon: Zap,
    label: 'PIX',
    description: 'Transferências instantâneas',
    color: 'blue',
    featured: true,
  },
  {
    id: 'cards',
    icon: CreditCard,
    label: 'Cartões',
    description: 'Gerencie seus cartões',
    color: 'purple',
    featured: true,
  },
  {
    id: 'crypto',
    icon: Bitcoin,
    label: 'Criptomoedas',
    description: 'Compre e venda cripto',
    color: 'orange',
    featured: true,
  },
  {
    id: 'investments',
    icon: TrendingUp,
    label: 'Investimentos',
    description: 'Invista seu dinheiro',
    color: 'green',
    featured: true,
  },
  {
    id: 'goals',
    icon: Target,
    label: 'Metas',
    description: 'Defina e acompanhe metas',
    color: 'pink',
    featured: true,
  },
  {
    id: 'debts',
    icon: Receipt,
    label: 'Dívidas',
    description: 'Controle suas dívidas',
    color: 'red',
    featured: true,
  },
  {
    id: 'shop',
    icon: ShoppingBag,
    label: 'Shopping',
    description: 'Compre com cashback',
    color: 'purple',
  },
  {
    id: 'giftcard',
    icon: Tags,
    label: 'Gift Cards',
    description: 'Compre gift cards',
    color: 'pink',
  },
  {
    id: 'recharge',
    icon: Phone,
    label: 'Recargas',
    description: 'Recarga de celular',
    color: 'cyan',
  },
  {
    id: 'cashback',
    icon: Gift,
    label: 'Cashback',
    description: 'Resgate seus pontos',
    color: 'yellow',
  },
  {
    id: 'insurance',
    icon: Shield,
    label: 'Seguros',
    description: 'Proteja seu patrimônio',
    color: 'blue',
  },
  {
    id: 'loan',
    icon: Banknote,
    label: 'Empréstimos',
    description: 'Solicite crédito',
    color: 'green',
  },
  {
    id: 'savings',
    icon: PiggyBank,
    label: 'Poupança',
    description: 'Economize para o futuro',
    color: 'purple',
  },
  {
    id: 'payment',
    icon: Smartphone,
    label: 'Pagamentos',
    description: 'Pague contas e boletos',
    color: 'orange',
  },
  {
    id: 'extract',
    icon: FileText,
    label: 'Extrato',
    description: 'Veja suas transações',
    color: 'gray',
  },
  {
    id: 'security',
    icon: Lock,
    label: 'Segurança',
    description: 'Configure sua segurança',
    color: 'red',
  },
  {
    id: 'ai',
    icon: MessageCircle,
    label: 'Assistente IA',
    description: 'Ajuda inteligente',
    color: 'purple',
  },
  {
    id: 'rewards',
    icon: Percent,
    label: 'Recompensas',
    description: 'Ganhe benefícios',
    color: 'yellow',
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    glow: 'shadow-lg shadow-blue-500/20',
    hoverGlow: 'group-hover:shadow-blue-500/40',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500/20 to-violet-600/20',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
    glow: 'shadow-lg shadow-purple-500/20',
    hoverGlow: 'group-hover:shadow-purple-500/40',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500/20 to-red-600/20',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    glow: 'shadow-lg shadow-orange-500/20',
    hoverGlow: 'group-hover:shadow-orange-500/40',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20',
    border: 'border-green-500/40',
    text: 'text-green-400',
    glow: 'shadow-lg shadow-green-500/20',
    hoverGlow: 'group-hover:shadow-green-500/40',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
    border: 'border-pink-500/40',
    text: 'text-pink-400',
    glow: 'shadow-lg shadow-pink-500/20',
    hoverGlow: 'group-hover:shadow-pink-500/40',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500/20 to-rose-600/20',
    border: 'border-red-500/40',
    text: 'text-red-400',
    glow: 'shadow-lg shadow-red-500/20',
    hoverGlow: 'group-hover:shadow-red-500/40',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-600/20',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    glow: 'shadow-lg shadow-yellow-500/20',
    hoverGlow: 'group-hover:shadow-yellow-500/40',
  },
  gray: {
    bg: 'bg-gradient-to-br from-gray-500/20 to-slate-600/20',
    border: 'border-gray-500/40',
    text: 'text-gray-400',
    glow: 'shadow-lg shadow-gray-500/20',
    hoverGlow: 'group-hover:shadow-gray-500/40',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    glow: 'shadow-lg shadow-cyan-500/20',
    hoverGlow: 'group-hover:shadow-cyan-500/40',
  },
};

export default function AllFeaturesScreen({ onFeatureClick }) {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const handleFeatureClick = (featureId) => {
    if (onFeatureClick) {
      onFeatureClick(featureId);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Todos os Serviços</h2>
        <p className="text-sm text-gray-400">Explore todas as funcionalidades disponíveis</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isVisible = visibleCards.includes(index);
          return (
            <div
              key={feature.id}
              ref={(el) => (cardsRef.current[index] = el)}
              data-index={index}
              className={`transform transition-all duration-500 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${(index % 2) * 100}ms`,
              }}
            >
              <Card 
                className="hover:bg-[hsl(var(--card))]/80 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => handleFeatureClick(feature.id)}
                style={{
                  transform: 'perspective(1000px) rotateX(0deg)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(-2deg) translateY(-2px) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-8px)';
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-violet-600/0 group-hover:from-purple-600/10 group-hover:to-violet-600/10 transition-all duration-300 pointer-events-none" />
                
                <CardContent className="pt-4 pb-4 relative z-10">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div 
                      className={`
                        w-16 h-16 rounded-2xl border-2 flex items-center justify-center 
                        transition-all duration-300 relative overflow-hidden
                        ${colorClasses[feature.color].bg} 
                        ${colorClasses[feature.color].border} 
                        ${colorClasses[feature.color].text}
                        ${colorClasses[feature.color].glow}
                        ${colorClasses[feature.color].hoverGlow}
                        group-hover:scale-110 group-hover:rotate-6
                        ${feature.featured ? 'ring-2 ring-purple-500/30 ring-offset-2 ring-offset-[hsl(var(--card))]' : ''}
                      `}
                    >
                      {/* Background glow effect */}
                      <div className={`absolute inset-0 ${colorClasses[feature.color].bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Animated particles for featured items */}
                      {feature.featured && (
                        <>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.2s' }} />
                        </>
                      )}
                      
                      <Icon className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" 
                        style={{
                          filter: 'drop-shadow(0 0 8px currentColor)',
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm mb-1 group-hover:text-purple-300 transition-colors flex items-center justify-center gap-1">
                        {feature.label}
                        {feature.featured && (
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 leading-tight group-hover:text-gray-300 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 mt-auto group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Version Info */}
      <div className="text-center pt-4 pb-2">
        <p className="text-xs text-gray-500">VOX<span className="text-amber-500">PAY</span> v1.0.0</p>
        <p className="text-xs text-gray-600 mt-1">Hackathon MVP 2025</p>
      </div>
    </div>
  );
}
