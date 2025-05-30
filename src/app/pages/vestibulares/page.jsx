'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, GraduationCap, Calendar, BookOpen, School, Search, Star, StarOff, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { BaseFormField, SelectFormField, IconSelector } from "@/components/ui/formfield";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,

} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";


const VESTIBULAR_CATEGORIES = [
  { value: 'publico', label: 'Público' },
  { value: 'privado', label: 'Privado' }
];

const ICON_OPTIONS = {
  vestibulares: [
    { label: 'Graduação', value: 'GraduationCap', icon: GraduationCap },
    { label: 'Livro', value: 'BookOpen', icon: BookOpen },
    { label: 'Escola', value: 'School', icon: School },
    { label: 'Calendário', value: 'Calendar', icon: Calendar }
  ]
};
const vestibulares = require("@/dados/vestibulares.json");



const iconMap = {
  GraduationCap: GraduationCap,
  BookOpen: BookOpen,
  School: School,
  Calendar: Calendar
};

export default function VestibularesPage() {
  const { userRole } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [isCreateVestibularModalOpen, setIsCreateVestibularModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Simulate loading user role
    const timer = setTimeout(() => {
      setIsAuthorized(true);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('vestibulares_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (title) => {
    const newFavorites = favorites.includes(title)
      ? favorites.filter(fav => fav !== title)
      : [...favorites, title];
    setFavorites(newFavorites);
    localStorage.setItem('vestibulares_favorites', JSON.stringify(newFavorites));
  };

  const types = [
    { id: 'todos', label: 'Todos' },
    { id: 'publico', label: 'Públicos' },
    { id: 'privado', label: 'Privados' }
  ];

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'todos' || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  };



  const CreateVestibularModal = () => {
    const form = useForm();
    const onSubmit = (data) => {
      console.log(data);
    };
    return (
      <>
        <Dialog open={isCreateVestibularModalOpen} onOpenChange={setIsCreateVestibularModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Vestibular</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <BaseFormField
                  control={form.control}
                  name="name"
                  label="Nome do Vestibular"
                  placeholder="Nome do Vestibular"
                />
                <BaseFormField
                  control={form.control}
                  name="link"
                  label="Link do Vestibular"
                  placeholder="https://..."
                />
                <SelectFormField
                  control={form.control}
                  name="tipo_concurso"
                  label="Categoria"
                  options={VESTIBULAR_CATEGORIES}
                  placeholder="Selecione a categoria"
                />
                <BaseFormField
                  control={form.control}
                  name="data"
                  label="Data do Vestibular"
                  type="date"
                />
                <IconSelector
                  control={form.control}
                  name="icone"
                  label="Ícone"
                  options={ICON_OPTIONS.vestibulares}
                  form={form}
                />
                <BaseFormField
                  control={form.control}
                  name="descricao"
                  label="Descrição"
                  placeholder="Descrição do vestibular"
                />


                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateVestibularModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      setIsCreateVestibularModalOpen(false);
                    }}
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Vestibular'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </>
    );
  };

  const uniqueDates = [...new Set(vestibulares.map(v => v.date))];
  const uniqueTypes = [...new Set(vestibulares.map(v => v.type))];
  const uniqueStates = [...new Set(vestibulares.map(v => v.state))];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mx-auto">
          <div className="flex flex-col items-center mb-6 bg-white rounded-lg shadow-lg p-4">
            <Logo className="h-9 w-9" variant="icon" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Vestibulares</h1>
            <p className="mt-2 text-center">Acompanhe os principais vestibulares do Brasil</p>
          </div>
          {isAuthorized && userRole === "admin" && (
            <Button onClick={() => setIsCreateVestibularModalOpen(true)} className="mb-4">
              <Plus className="h-4 w-4 mr-2 " />
              Novo Vestibular
            </Button>
          )}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar vestibulares..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filterItems(vestibulares).map((vestibular) => (
              <Card
                key={vestibular.title}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-white h-[300px] w-full"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${vestibular.color} text-white`}>
                      {React.createElement(iconMap[vestibular.icon], { className: "h-6 w-6" })}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(vestibular.title)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {favorites.includes(vestibular.title) ? (
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {vestibular.date}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4 h-[32px] line-clamp-1">{vestibular.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 h-[48px] line-clamp-2">{vestibular.description}</p>
                  <Button
                    className="w-full bg-[#133D86] hover:bg-[#0e2a5c] transition-colors duration-300"
                    onClick={() => window.open(vestibular.link, '_blank')}
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
    <CreateVestibularModal />
    </>
  );
} 