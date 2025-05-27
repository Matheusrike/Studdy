'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Download, BookOpen, Video, PenTool } from 'lucide-react';
import Link from 'next/link';

export default function ApostilasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApostila, setSelectedApostila] = useState(null);
    const apostilas = [
        {
            id: 1,
            titulo: "Aprender Sempre 2025",
            categoria: "Matemática",
            serie: "6º Ano",
            descricao: "Material completo sobre mecânica clássica",
            dataUpload: "2024-03-15",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_6%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 2,
            titulo: "Aporender Sempre",
            categoria: "Português",
            serie: "6º Ano",
            descricao: "Conceitos fundamentais de química",
            dataUpload: "2024-03-14",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_6%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 3,
            titulo: "Apostila de Biologia",
            categoria: "Biologia",
            serie: "6º Ano",
            descricao: "Biologia celular e molecular",
            dataUpload: "2024-03-13",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_6%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 4,
            titulo: "Apostila de História",
            categoria: "História",
            serie: "7º Ano",
            descricao: "História do Brasil Colonial",
            dataUpload: "2024-03-12",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_7%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 5,
            titulo: "Apostila de Geografia",
            categoria: "Geografia",
            serie: "7º Ano",
            descricao: "Geografia Física e Humana",
            dataUpload: "2024-03-11",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_7%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 6,
            titulo: "Apostila de Física",
            categoria: "Física",
            serie: "8º Ano",
            descricao: "Mecânica e Termodinâmica",
            dataUpload: "2024-03-10",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_8%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 7,
            titulo: "Apostila de Química",
            categoria: "Química",
            serie: "8º Ano",
            descricao: "Química Geral e Inorgânica",
            dataUpload: "2024-03-09",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_8%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 8,
            titulo: "Apostila de Literatura",
            categoria: "Literatura",
            serie: "9º Ano",
            descricao: "Literatura Brasileira e Portuguesa",
            dataUpload: "2024-03-08",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_9%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 9,
            titulo: "Apostila de Inglês",
            categoria: "Inglês",
            serie: "9º Ano",
            descricao: "Gramática e Conversação",
            dataUpload: "2024-03-07",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_9%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 10,
            titulo: "Apostila de Arte",
            categoria: "Arte",
            serie: "9º Ano",
            descricao: "História da Arte e Técnicas",
            dataUpload: "2024-03-06",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_9%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 11,
            titulo: "Apostila de Educação Física",
            categoria: "Educação Física",
            serie: "6º Ano",
            descricao: "Esportes e Atividades Físicas",
            dataUpload: "2024-03-05",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_6%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 12,
            titulo: "Apostila de Filosofia",
            categoria: "Filosofia",
            serie: "7º Ano",
            descricao: "Introdução à Filosofia",
            dataUpload: "2024-03-04",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_7%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        },
        {
            id: 13,
            titulo: "Apostila de Sociologia",
            categoria: "Sociologia",
            serie: "8º Ano",
            descricao: "Fundamentos da Sociologia",
            dataUpload: "2024-03-03",
            downloadUrl: "https://efape.educacao.sp.gov.br/curriculopaulista/wp-content/uploads/2024/02/AS_2024_8%C2%BA-Ano_1%C2%BA-Semestre.pdf"
        }
    ];

    const filteredApostilas = apostilas.filter(apostila =>
        apostila.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apostila.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen">
            
            {/* Conteúdo principal */}
            <div className="flex-1 overflow-auto">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Apostilas
                        </h1>
                        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative w-full lg:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar apostilas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-12rem)]">
                        {/* Lista de apostilas */}
                        <div className="xl:col-span-1 h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                            <div className="space-y-4">
                                {filteredApostilas.map((apostila) => (
                                    <Card
                                        key={apostila.id}
                                        className={`cursor-pointer transition-all hover:shadow-lg ${
                                            selectedApostila?.id === apostila.id ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                        onClick={() => setSelectedApostila(apostila)}
                                    >
                                        <CardHeader className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="break-words text-base sm:text-sm md:text-base lg:text-lg xl:text-xl">{apostila.titulo}</CardTitle>
                                                    <CardDescription className="mt-1 truncate">
                                                        {apostila.serie}
                                                    </CardDescription>
                                                </div>
                                                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    {apostila.dataUpload}
                                                </span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {apostila.categoria}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Visualizador de apostila */}
                        <div className="xl:col-span-2">
                            {selectedApostila ? (
                                <Card className="h-full">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl">{selectedApostila.titulo}</CardTitle>
                                                <CardDescription>
                                                    {selectedApostila.serie} • {selectedApostila.dataUpload}
                                                </CardDescription>
                                            </div>
                                            <Button variant="outline" className="flex items-center gap-2">
                                                <Download className="h-4 w-4" />
                                                Download
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {selectedApostila.descricao}
                                            </p>
                                            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                <iframe
                                                    src={`${selectedApostila.downloadUrl}#toolbar=0`}
                                                    className="w-full h-full rounded-lg"
                                                    title={selectedApostila.titulo}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="h-full flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Selecione uma apostila para visualizar
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}