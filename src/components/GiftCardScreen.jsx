import React, { useState } from 'react';
import { Card, CardContent, Input, Button } from './ui';
import { Search, Heart, ChevronLeft } from 'lucide-react';

const giftCards = [
  {
    id: 1,
    name: 'Google Play',
    cashback: 12,
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
    bgColor: 'from-white to-gray-100',
    values: [50, 100, 150, 200],
  },
  {
    id: 2,
    name: 'App Store',
    cashback: 10,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg',
    bgColor: 'from-blue-400 to-blue-600',
    values: [50, 100, 150, 200],
  },
  {
    id: 3,
    name: 'Xbox Game Pass Ultimate',
    cashback: 12,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
    bgColor: 'from-gray-800 to-black',
    banner: 'Jogos populares',
    values: [45, 90, 135],
  },
  {
    id: 4,
    name: 'Airbnb',
    cashback: 0,
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    bgColor: 'from-pink-400 to-pink-600',
    banner: 'Até 2x sem juros',
    values: [100, 200, 500],
  },
  {
    id: 5,
    name: 'FREE FIRE',
    cashback: 0,
    bonus: true,
    image: 'https://i.imgur.com/freefire.png',
    bgColor: 'from-orange-500 to-red-600',
    values: [50, 100, 200],
  },
  {
    id: 6,
    name: 'Xbox',
    cashback: 12,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
    bgColor: 'from-green-500 to-green-700',
    values: [50, 100, 200, 500],
  },
  {
    id: 7,
    name: 'Roblox',
    cashback: 6,
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Roblox_Logo_2022.svg',
    bgColor: 'from-gray-800 to-black',
    banner: 'Aproveite até 15% Robux a mais',
    values: [50, 100, 200],
  },
  {
    id: 8,
    name: 'XBOX GAME PASS PC',
    cashback: 6,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg',
    bgColor: 'from-gray-800 to-black',
    banner: 'Jogos populares',
    values: [35, 70, 105],
  },
  {
    id: 9,
    name: 'Nintendo eShop',
    cashback: 8,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg',
    bgColor: 'from-red-500 to-red-700',
    values: [50, 100, 200, 500],
  },
  {
    id: 10,
    name: 'Netflix',
    cashback: 5,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    bgColor: 'from-red-600 to-red-800',
    values: [50, 100, 200],
  },
  {
    id: 11,
    name: 'Spotify',
    cashback: 7,
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    bgColor: 'from-green-400 to-green-600',
    values: [20, 50, 100],
  },
  {
    id: 12,
    name: 'Steam',
    cashback: 10,
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    bgColor: 'from-blue-900 to-gray-900',
    values: [50, 100, 200, 500],
  },
];

export default function GiftCardScreen({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const filteredCards = giftCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-2xl font-bold text-white">Gift Card</h2>
          <p className="text-sm text-gray-400">Escolha seu cartão presente</p>
        </div>
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

      {/* Gift Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filteredCards.map((card) => (
          <Card 
            key={card.id}
            className="hover:bg-[hsl(var(--card))]/80 transition-all cursor-pointer group relative overflow-hidden"
          >
            <CardContent className="pt-4 pb-4">
              <div className="space-y-3">
                {/* Card Image with Gradient Background */}
                <div className={`w-full aspect-[4/3] bg-gradient-to-br ${card.bgColor} rounded-xl flex items-center justify-center p-4 relative overflow-hidden`}>
                  {card.banner && (
                    <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-[10px] font-bold text-center py-1 px-2">
                      {card.banner}
                    </div>
                  )}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">
                      {card.name}
                    </h3>
                    {card.cashback > 0 ? (
                      <p className="text-xs text-green-400 font-medium">
                        {card.cashback}% de cashback
                      </p>
                    ) : card.bonus ? (
                      <p className="text-xs text-purple-400 font-medium">
                        Cashback + Bônus
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Sem cashback
                      </p>
                    )}
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(card.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-[hsl(var(--secondary))] transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        favorites.has(card.id)
                          ? 'fill-orange-500 text-orange-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Available Values */}
                <div className="flex flex-wrap gap-1">
                  {card.values.slice(0, 2).map((value, index) => (
                    <span
                      key={index}
                      className="text-[10px] bg-[hsl(var(--secondary))] text-gray-300 px-2 py-0.5 rounded"
                    >
                      R$ {value}
                    </span>
                  ))}
                  {card.values.length > 2 && (
                    <span className="text-[10px] text-gray-400 px-1 py-0.5">
                      +{card.values.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Categorias Populares</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" className="text-sm">
            🎮 Games
          </Button>
          <Button variant="secondary" className="text-sm">
            📺 Streaming
          </Button>
          <Button variant="secondary" className="text-sm">
            🛍️ Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
