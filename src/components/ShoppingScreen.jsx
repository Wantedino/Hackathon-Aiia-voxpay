import React, { useState } from 'react';
import { Card, CardContent, Input, Button } from './ui';
import { Search, ShoppingCart, Sparkles, Tag, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const categories = [
  { id: 'games', name: 'Games', icon: '🎮' },
  { id: 'tablets', name: 'Tablets', icon: '📱' },
  { id: 'ac', name: 'Ar e ventilação', icon: '❄️' },
  { id: 'audio', name: 'Áudio', icon: '🔊' },
  { id: 'computers', name: 'Computadores', icon: '💻' },
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'tvs', name: 'Smart TVs', icon: '📺' },
  { id: 'eletro', name: 'Eletrodomésticos', icon: '🏠' },
];

const featuredProducts = [
  {
    id: 1,
    name: 'Smartphone Motorola Moto g15',
    description: '128GB Azul Claro',
    originalPrice: 1299.00,
    price: 588.72,
    discount: 48,
    cashback: 5,
    installments: 36,
    image: 'https://i.imgur.com/pqbNCVk.jpg',
    category: 'smartphones',
  },
  {
    id: 2,
    name: 'Fritadeira Airfryer 4L',
    description: 'BlackStone Preta Mica',
    originalPrice: 499.00,
    price: 199.00,
    discount: 60,
    cashback: 3,
    installments: 36,
    image: 'https://i.imgur.com/PDFfo8s.jpg',
    category: 'eletro',
  },
  {
    id: 3,
    name: 'Smart TV Samsung 65"',
    description: '4K UHD Crystal',
    originalPrice: 3499.00,
    price: 2599.00,
    discount: 26,
    cashback: 8,
    installments: 36,
    image: 'https://i.imgur.com/g9vNkFH.jpg',
    category: 'tvs',
  },
  {
    id: 4,
    name: 'Notebook Lenovo IdeaPad',
    description: 'Intel Core i5 8GB 256GB SSD',
    originalPrice: 3299.00,
    price: 2499.00,
    discount: 24,
    cashback: 10,
    installments: 36,
    image: 'https://i.imgur.com/UmXNoPo.jpg',
    category: 'computers',
  },
  {
    id: 5,
    name: 'Fone JBL Tune 510BT',
    description: 'Bluetooth Preto',
    originalPrice: 299.00,
    price: 179.00,
    discount: 40,
    cashback: 2,
    installments: 12,
    image: 'https://i.imgur.com/Vz1AQEl.jpg',
    category: 'audio',
  },
  {
    id: 6,
    name: 'PlayStation 5',
    description: 'Console + 2 Jogos',
    originalPrice: 4299.00,
    price: 3899.00,
    discount: 9,
    cashback: 15,
    installments: 36,
    image: 'https://i.imgur.com/YNdBLFz.jpg',
    category: 'games',
  },
  {
    id: 7,
    name: 'Tablet Samsung Galaxy Tab A9',
    description: '64GB WiFi Grafite',
    originalPrice: 1099.00,
    price: 799.00,
    discount: 27,
    cashback: 4,
    installments: 24,
    image: 'https://i.imgur.com/eg6VBt3.jpg',
    category: 'tablets',
  },
  {
    id: 8,
    name: 'Ar Condicionado LG 12000 BTUs',
    description: 'Inverter Dual Voice',
    originalPrice: 2499.00,
    price: 1899.00,
    discount: 24,
    cashback: 7,
    installments: 36,
    image: 'https://i.imgur.com/Axle8KN.jpg',
    category: 'ac',
  },
];

export default function ShoppingScreen({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h2 className="text-2xl font-bold text-white">Shopping</h2>
          <p className="text-sm text-gray-400">Compre com cashback</p>
        </div>
        <button className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors relative">
          <ShoppingCart className="w-6 h-6 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
            0
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3 pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-[hsl(var(--card))] text-gray-400 hover:text-gray-300'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-[hsl(var(--card))] text-gray-400 hover:text-gray-300'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Banner */}
      <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  ORANGE FRIDAY
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                OFERTAS QUE CABEM NO SEU BOLSO!
              </h3>
              <p className="text-sm text-gray-400">
                Até 60% de desconto + cashback
              </p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id}
            className="hover:bg-[hsl(var(--card))]/80 transition-all cursor-pointer group"
          >
            <CardContent className="pt-4 pb-4">
              <div className="space-y-3">
                {/* Product Image */}
                <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden mb-2 p-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-2 mb-1 group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {product.description}
                  </p>
                </div>

                {/* Price Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-green-400 bg-green-600/20 px-2 py-0.5 rounded">
                      {product.discount}% off
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {formatCurrency(product.price)}
                  </div>
                  <p className="text-xs text-gray-400">
                    à vista no Pix
                  </p>
                </div>

                {/* Installments */}
                <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg px-2 py-1.5">
                  <p className="text-xs text-orange-400 font-medium">
                    💳 até {product.installments}x no Crediário
                  </p>
                </div>

                {/* Cashback Badge */}
                {product.cashback > 0 && (
                  <div className="flex items-center gap-1 bg-amber-600/20 border border-amber-500/30 rounded-lg px-2 py-1">
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">
                      {product.cashback}% cashback
                    </span>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="sm"
                >
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {}}
      >
        Mostrar mais
      </Button>

      {/* Special Offers Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-bold text-white">Ofertas Especiais</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-4xl mb-2">📱</div>
              <h4 className="text-sm font-bold text-white mb-1">Smartphones</h4>
              <p className="text-xs text-orange-400">Até 50% OFF</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-4xl mb-2">📺</div>
              <h4 className="text-sm font-bold text-white mb-1">Smart TVs</h4>
              <p className="text-xs text-orange-400">Até 40% OFF</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
