'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, Calendar, Shield, Briefcase, School, Building2, Landmark, Scale, Search, Star, StarOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import React from "react";

const concursos = require("@/dados/concursos.json");

export default function ConcursosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [favorites, setFavorites] = useState([]);

  const iconMap = {
    Shield: Shield,
    School: School,
    Briefcase: Briefcase,
    Building2: Building2,
    Landmark: Landmark,
    Scale: Scale
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem('concursos_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (title) => {
    const newFavorites = favorites.includes(title)
      ? favorites.filter(fav => fav !== title)
      : [...favorites, title];
    setFavorites(newFavorites);
    localStorage.setItem('concursos_favorites', JSON.stringify(newFavorites));
  };

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'militares', label: 'Militares' },
    { id: 'bancarios', label: 'Bancários' },
    { id: 'federais', label: 'Federais' },
    { id: 'estaduais', label: 'Estaduais' }
  ];

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mx-auto">
          <div className="flex flex-col items-center mb-6 bg-white rounded-lg shadow-lg p-4">
            <Logo className="h-9 w-9" variant="icon" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Concursos Públicos</h1>
            <p className="mt-2 text-center">Acompanhe as principais oportunidades de carreira pública</p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar concursos..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filterItems(concursos).map((concurso) => (
              <Card
                key={concurso.title}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-white h-[300px] w-full"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${concurso.color} text-white`}>
                      {React.createElement(iconMap[concurso.icon], { className: "h-6 w-6" })}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(concurso.title)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {favorites.includes(concurso.title) ? (
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {concurso.date}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4 h-[32px] line-clamp-1">{concurso.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 h-[48px] line-clamp-2">{concurso.description}</p>
                  <Button
                    className="w-full bg-[#133D86] hover:bg-[#0e2a5c] transition-colors duration-300"
                    onClick={() => window.open(concurso.link, '_blank')}
                  >
                    Acessar Site Oficial
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 