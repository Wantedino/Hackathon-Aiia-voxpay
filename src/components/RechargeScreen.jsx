import React, { useState } from 'react';
import { Card, CardContent, Input, Button } from './ui';
import { ChevronLeft, Smartphone, Bus, Tv, Gamepad2 } from 'lucide-react';

const services = [
  { id: 'mobile', name: 'Celular', icon: Smartphone, color: 'emerald' },
  { id: 'transport', name: 'Transporte', icon: Bus, color: 'white' },
  { id: 'tv', name: 'TV Pré', icon: Tv, color: 'white' },
  { id: 'games', name: 'Games', icon: Gamepad2, color: 'white' },
];

const operators = [
  { id: 'vivo', name: 'Vivo', color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-600' },
  { id: 'claro', name: 'Claro', color: 'from-red-600 to-red-700', bgColor: 'bg-red-600' },
  { id: 'tim', name: 'TIM', color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-600' },
  { id: 'oi', name: 'Oi', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500' },
];

const rechargeValues = [
  { value: 10, bonus: 0 },
  { value: 15, bonus: 0 },
  { value: 20, bonus: 2 },
  { value: 30, bonus: 5 },
  { value: 50, bonus: 10 },
  { value: 100, bonus: 25 },
];

export default function RechargeScreen({ onBack }) {
  const [selectedService, setSelectedService] = useState('mobile');
  const [selectedOperator, setSelectedOperator] = useState('vivo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phoneNumber;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const totalValue = selectedValue 
    ? rechargeValues.find(r => r.value === selectedValue)?.value || 0
    : 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">Recargas</h2>
        </div>
      </div>

      {/* Service Selection */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Selecione o Serviço</h3>
        <div className="grid grid-cols-4 gap-2">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-4 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-700'}`} />
                <p className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                  {service.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Selection */}
      {selectedService === 'mobile' && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Operadora</h3>
          <div className="grid grid-cols-4 gap-2">
            {operators.map((operator) => (
              <button
                key={operator.id}
                onClick={() => setSelectedOperator(operator.id)}
                className={`p-4 rounded-xl font-bold text-white transition-all ${
                  selectedOperator === operator.id
                    ? `bg-gradient-to-br ${operator.color} shadow-lg`
                    : `${operator.bgColor} opacity-60 hover:opacity-80`
                }`}
              >
                {operator.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phone Number Input */}
      {selectedService === 'mobile' && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Número do Celular</h3>
          <Input
            type="tel"
            placeholder="(11) 99999-9999"
            value={phoneNumber}
            onChange={handlePhoneChange}
            maxLength={15}
            className="bg-white text-gray-900"
          />
        </div>
      )}

      {/* Recharge Values */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Valor da Recarga</h3>
        <div className="grid grid-cols-3 gap-2">
          {rechargeValues.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedValue(item.value)}
              className={`p-4 rounded-xl transition-all ${
                selectedValue === item.value
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white border-2 border-purple-400'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <p className={`text-lg font-bold ${selectedValue === item.value ? 'text-white' : 'text-gray-900'}`}>
                R$ {item.value}
              </p>
              {item.bonus > 0 && (
                <p className={`text-xs mt-1 ${selectedValue === item.value ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  +R$ {item.bonus} bônus
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t border-gray-700">
        <span className="text-sm text-gray-400">Valor da recarga:</span>
        <span className="text-2xl font-bold text-white">
          R$ {totalValue.toFixed(2).replace('.', ',')}
        </span>
      </div>

      {/* Confirm Button */}
      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-4"
        disabled={!phoneNumber || !selectedValue}
      >
        Confirmar Recarga
      </Button>
    </div>
  );
}