import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, TrendingDown, Shield, Zap, Rocket, ChevronRight, X, PieChart } from 'lucide-react';

const investmentOptions = [
  // Baixo Risco
  {
    id: 'tesouro-selic',
    name: 'Tesouro Selic',
    type: 'Renda Fixa',
    risk: 'low',
    riskLabel: 'Baixo Risco',
    returnRate: '12.5% a.a.',
    minInvestment: 100,
    liquidity: 'Diária',
    icon: Shield,
    color: 'green',
    description: 'Investimento seguro e com liquidez diária'
  },
  {
    id: 'cdb',
    name: 'CDB 110% CDI',
    type: 'Renda Fixa',
    risk: 'low',
    riskLabel: 'Baixo Risco',
    returnRate: '13.2% a.a.',
    minInvestment: 500,
    liquidity: '90 dias',
    icon: Shield,
    color: 'green',
    description: 'Certificado de Depósito Bancário'
  },
  // Médio Risco
  {
    id: 'fundo-multimercado',
    name: 'Fundo Multimercado',
    type: 'Fundos',
    risk: 'medium',
    riskLabel: 'Médio Risco',
    returnRate: '18.5% a.a.',
    minInvestment: 1000,
    liquidity: '30 dias',
    icon: Zap,
    color: 'orange',
    description: 'Diversificação em várias classes de ativos'
  },
  {
    id: 'fiis',
    name: 'Fundos Imobiliários',
    type: 'Fundos',
    risk: 'medium',
    riskLabel: 'Médio Risco',
    returnRate: '15.8% a.a.',
    minInvestment: 200,
    liquidity: 'Diária',
    icon: Zap,
    color: 'orange',
    description: 'Renda passiva com imóveis'
  },
  // Alto Risco
  {
    id: 'acoes',
    name: 'Ações Nacionais',
    type: 'Renda Variável',
    risk: 'high',
    riskLabel: 'Alto Risco',
    returnRate: '25%+ a.a.',
    minInvestment: 100,
    liquidity: 'Diária',
    icon: Rocket,
    color: 'red',
    description: 'Potencial de alto retorno'
  },
  {
    id: 'cripto',
    name: 'Criptomoedas',
    type: 'Renda Variável',
    risk: 'high',
    riskLabel: 'Alto Risco',
    returnRate: 'Variável',
    minInvestment: 50,
    liquidity: 'Diária',
    icon: Rocket,
    color: 'red',
    description: 'Ativos digitais de alta volatilidade'
  },
];

export default function InvestmentsScreen({ onOpenInvest }) {
  const { transactions, balance } = useApp();
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const investments = transactions.filter((t) => t.category === 'investment');
  const investedTotal = investments.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Simular rentabilidade (5% sobre o total investido)
  const estimatedReturn = investedTotal * 0.05;
  const totalWithReturn = investedTotal + estimatedReturn;

  // Agrupar investimentos por tipo (extrair do título)
  const investmentsByType = investments.reduce((acc, inv) => {
    const title = inv.title.replace('Investimento ', '');
    const amount = Math.abs(inv.amount);
    
    if (acc[title]) {
      acc[title] += amount;
    } else {
      acc[title] = amount;
    }
    return acc;
  }, {});

  // Converter para array e calcular percentuais
  const investmentBreakdown = Object.entries(investmentsByType).map(([name, amount]) => ({
    name,
    amount,
    percentage: investedTotal > 0 ? (amount / investedTotal) * 100 : 0,
  })).sort((a, b) => b.amount - a.amount);

  // Cores para o gráfico
  const chartColors = [
    'bg-amber-500',
    'bg-orange-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-fuchsia-500',
  ];

  const filteredOptions = selectedRisk === 'all' 
    ? investmentOptions 
    : investmentOptions.filter(opt => opt.risk === selectedRisk);

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-green-400 bg-green-600/20 border-green-500/30';
      case 'medium': return 'text-orange-400 bg-orange-600/20 border-orange-500/30';
      case 'high': return 'text-red-400 bg-red-600/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Balance Card - Similar à print */}
      <button 
        onClick={() => setShowDetailsModal(true)}
        className="w-full text-left"
      >
        <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Saldo em Investimentos</p>
                <h2 className="text-3xl font-bold text-white mt-1">{formatCurrency(totalWithReturn)}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-1 bg-amber-600/30 rounded-md text-amber-300">VISA</span>
              </div>
            </div>
            
            {/* Retorno estimado */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-amber-500/20">
              <div className="flex-1">
                <p className="text-xs text-gray-400">Investido</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(investedTotal)}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Rendimento</p>
                <p className="text-sm font-semibold text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{formatCurrency(estimatedReturn)}
                </p>
              </div>
              <div className="flex items-center">
                <PieChart className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </button>

      {/* Filtros de Risco */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'low', label: 'Baixo Risco' },
          { id: 'medium', label: 'Médio Risco' },
          { id: 'high', label: 'Alto Risco' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedRisk(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedRisk === filter.id
                ? 'bg-amber-600 text-white'
                : 'bg-[hsl(var(--card))] text-gray-400 hover:text-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Opções de Investimento */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Opções de Investimento</h3>
        </div>
        
        <div className="space-y-3">
          {filteredOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => onOpenInvest && onOpenInvest()}
                className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4 hover:border-amber-500/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl ${option.color === 'green' ? 'bg-green-600/20' : option.color === 'orange' ? 'bg-orange-600/20' : 'bg-red-600/20'}`}>
                    <Icon className={`w-5 h-5 ${option.color === 'green' ? 'text-green-400' : option.color === 'orange' ? 'text-orange-400' : 'text-red-400'}`} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{option.name}</h4>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-2">{option.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-md border ${getRiskColor(option.risk)}`}>
                        {option.riskLabel}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-md bg-amber-600/20 text-amber-300">
                        {option.returnRate}
                      </span>
                      <span className="text-xs text-gray-500">
                        Min. {formatCurrency(option.minInvestment)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meus Aportes */}
      {investments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-3">Meus Aportes</h3>
          <div className="space-y-2">
            {investments.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{inv.title}</p>
                    <p className="text-xs text-gray-400">{new Date(inv.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white text-sm">{formatCurrency(Math.abs(inv.amount))}</p>
                  <p className="text-xs text-green-400">+5.0%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Modal de Detalhes dos Investimentos */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up max-h-[85vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-4 sticky top-0 bg-[hsl(var(--card))] z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600/20 rounded-xl">
                  <PieChart className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl">Detalhes dos Investimentos</CardTitle>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo Total */}
              <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400">Patrimônio Total</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{formatCurrency(totalWithReturn)}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-500/20">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Investido</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(investedTotal)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Rendimento</p>
                    <p className="text-lg font-semibold text-green-400">+{formatCurrency(estimatedReturn)}</p>
                  </div>
                </div>
              </div>

              {/* Gráfico de Barras com Percentuais */}
              {investmentBreakdown.length > 0 ? (
                <>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Distribuição por Tipo</h4>
                    <div className="space-y-3">
                      {investmentBreakdown.map((item, index) => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${chartColors[index % chartColors.length]}`}></div>
                              <span className="text-sm text-white font-medium">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-white">{item.percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[hsl(var(--secondary))] rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full ${chartColors[index % chartColors.length]} transition-all`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-20 text-right">{formatCurrency(item.amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gráfico de Pizza Simplificado */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Visualização Gráfica</h4>
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto">
                      {/* Pizza Chart usando conic-gradient */}
                      <div 
                        className="w-full h-full rounded-full"
                        style={{
                          background: `conic-gradient(${investmentBreakdown.map((item, index) => {
                            const start = investmentBreakdown.slice(0, index).reduce((acc, curr) => acc + curr.percentage, 0);
                            const end = start + item.percentage;
                            const color = ['#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#ec4899', '#d946ef'][index % 6];
                            return `${color} ${start}% ${end}%`;
                          }).join(', ')})`
                        }}
                      >
                        {/* Centro branco para criar efeito donut */}
                        <div className="absolute inset-[25%] bg-[hsl(var(--card))] rounded-full flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="text-lg font-bold text-white">{formatCurrency(investedTotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legenda */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Legenda</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {investmentBreakdown.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-[hsl(var(--secondary))] rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded ${chartColors[index % chartColors.length]}`}></div>
                            <span className="text-sm text-white">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-white">{formatCurrency(item.amount)}</p>
                            <p className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Histórico de Aportes */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Histórico de Aportes</h4>
                    <div className="space-y-2">
                      {investments.slice(0, 10).map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-3 bg-[hsl(var(--secondary))] rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-white">{inv.title}</p>
                            <p className="text-xs text-gray-400">{new Date(inv.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-white">{formatCurrency(Math.abs(inv.amount))}</p>
                            <p className="text-xs text-green-400">+5.0%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum investimento realizado ainda</p>
                  <p className="text-sm text-gray-500 mt-1">Comece a investir para ver seus dados aqui</p>
                </div>
              )}

              <Button onClick={() => setShowDetailsModal(false)} className="w-full" variant="secondary">
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
