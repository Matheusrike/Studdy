'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, Search, Calculator, Atom, Microscope, Globe, History, BookText, Brain, BookMarked, BookOpen, LineChart, TestTube, Dna, Landmark, BookOpenCheck, BookOpenText, BookOpenIcon, BookOpenCheckIcon, CircleCheck, CircleDashed, CircleOff, Ban, Eye, Edit, Archive, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { QuizVisibility, getVisibilityText, getVisibilityColor, getVisibilityIcon } from './enums/QuizVisibility';

const statusVisibility = [
    { id: 'todos', label: 'Todos' },
    { id: QuizVisibility.DRAFT, label: 'Rascunho' },
    { id: QuizVisibility.PUBLIC, label: 'Público' },
    { id: QuizVisibility.ARCHIVED, label: 'Arquivado' }
];

export default function SimuladosPage() {
    const { userRole } = useUser();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [selectedVisibility, setSelectedVisibility] = useState('todos');
    const [favorites, setFavorites] = useState([]);
    const [quiz, setQuiz] = useState([]);

    const handleDetails = (simuladoId) => {
        router.push(`/pages/simulados/${simuladoId}`);
    };

    useEffect(() => {
        const savedFavorites = localStorage.getItem('simulados_favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Carregar simulados
    useEffect(() => {
        const fetchSimulados = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('Token não encontrado');
                    return;
                }

                console.log('Buscando simulados...');
                const response = await fetch('http://localhost:3000/teacher/classes/1/subjects/1/quizzes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar simulados');
                }

                const data = await response.json();
                console.log('Dados recebidos:', data);

                if (!Array.isArray(data)) {
                    console.error('Dados inválidos recebidos:', data);
                    toast.error('Formato de dados inválido');
                    return;
                }

                // Organizar simulados por categoria
                const organizedQuiz = {
                    exatas: [],
                    humanas: [],
                    linguagens: [],
                    biologicas: []
                };

                // Distribuir simulados nas categorias (você pode ajustar a lógica conforme necessário)
                data.forEach(simulado => {
                    // Adicionar propriedade visibility se não existir
                    if (!simulado.visibility) {
                        simulado.visibility = QuizVisibility.DRAFT;
                    }

                    // Filtrar simulados baseado no papel do usuário
                    // Estudantes só podem ver simulados publicados
                    if (userRole === 'student' && simulado.visibility !== QuizVisibility.PUBLIC) {
                        return; // Pular este simulado
                    }

                    // Categorizar baseado no título ou adicionar a uma categoria padrão
                    const title = (simulado.title || '').toLowerCase();
                    if (title.includes('matemática') || title.includes('física') || title.includes('química')) {
                        organizedQuiz.exatas.push(simulado);
                    } else if (title.includes('história') || title.includes('geografia') || title.includes('filosofia')) {
                        organizedQuiz.humanas.push(simulado);
                    } else if (title.includes('português') || title.includes('literatura') || title.includes('inglês')) {
                        organizedQuiz.linguagens.push(simulado);
                    } else if (title.includes('biologia') || title.includes('genética') || title.includes('ecologia')) {
                        organizedQuiz.biologicas.push(simulado);
                    } else {
                        // Categoria padrão
                        organizedQuiz.exatas.push(simulado);
                    }
                });

                setQuiz(organizedQuiz);
                console.log('Simulados organizados:', organizedQuiz);
            } catch (error) {
                toast.error('Erro ao carregar simulados');
                console.error('Erro detalhado:', error);
            }
        };

        fetchSimulados();
    }, []);

    const getSimuladoIcon = (name, section) => {
        const lowerName = (name || '').toLowerCase();

        if (section === 'exatas') {
            if (lowerName.includes('matemática')) {
                return lowerName.includes('avançada') ? LineChart : Calculator;
            }
            if (lowerName.includes('física')) {
                return Atom;
            }
            if (lowerName.includes('química')) {
                return lowerName.includes('orgânica') ? Microscope : TestTube;
            }
        }

        if (section === 'humanas') {
            if (lowerName.includes('história')) {
                return lowerName.includes('brasil') ? Landmark : History;
            }
            if (lowerName.includes('geografia')) {
                return Globe;
            }
        }

        if (section === 'linguagens') {
            if (lowerName.includes('português')) {
                return BookText;
            }
            if (lowerName.includes('literatura')) {
                return lowerName.includes('brasileira') ? BookMarked : BookOpenText;
            }
        }

        if (section === 'biologicas') {
            if (lowerName.includes('celular')) {
                return Brain;
            }
            if (lowerName.includes('genética')) {
                return Dna;
            }
            if (lowerName.includes('ecologia')) {
                return Globe;
            }
        }

        return BookOpen;
    };

    const getSimuladoColor = (section) => {
        switch (section) {
            case 'exatas':
                return 'bg-[#133D86]';
            case 'humanas':
                return 'bg-[#133D86]';
            case 'linguagens':
                return 'bg-[#133D86]';
            case 'biologicas':
                return 'bg-[#133D86]';
            default:
                return 'bg-[#133D86]';
        }
    };

    const getStatusColor = (visibility) => {
        return getVisibilityColor(visibility);
    };

    const getStatusText = (visibility) => {
        return getVisibilityText(visibility);
    };

    const getStatusIcon = (visibility) => {
        const iconName = getVisibilityIcon(visibility);
        switch (iconName) {
            case 'Eye':
                return Eye;
            case 'Edit':
                return Edit;
            case 'Archive':
                return Archive;
            case 'HelpCircle':
            default:
                return HelpCircle;
        }
    };

    const filterItems = (items) => {
        return items.filter(item => {
            const matchesSearch = (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.max_points?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesVisibility = selectedVisibility === 'todos' || item.visibility === selectedVisibility;
            return matchesSearch && matchesVisibility;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Simulados Educacionais</h1>
                        <p className="mt-2 text-center text-gray-600">Pratique com Simulados de várias disciplinas</p>
                    </div>

                    <div className="mb-8 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Buscar Simulados..."
                                className="pl-10 w-full h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filtros de visibilidade apenas para professores */}
                        {userRole === 'teacher' && (
                            <div className="flex flex-wrap gap-2">
                                {statusVisibility.map((visibility) => (
                                    <Button
                                        key={visibility.id}
                                        variant={selectedVisibility === visibility.id ? "default" : "outline"}
                                        className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 ${selectedVisibility === visibility.id
                                            ? 'bg-[#133D86] text-white hover:bg-[#0e2a5c]'
                                            : 'hover:bg-gray-100'
                                            }`}
                                        onClick={() => setSelectedVisibility(visibility.id)}
                                    >
                                        {visibility.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {Object.entries(quiz).map(([section, items]) => {
                        const filtered = filterItems(items);
                        if (filtered.length === 0) return null;
                        return (
                            <div key={section} className="mb-8">
                                <h2 className="text-2xl font-semibold text-[#133D86] mb-4 capitalize">
                                    {section === 'exatas' ? 'Ciências Exatas' :
                                        section === 'humanas' ? 'Ciências Humanas' :
                                            section === 'linguagens' ? 'Linguagens e Códigos' :
                                                'Ciências Biológicas'}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filtered.map((simulado) => {
                                        const Icon = getSimuladoIcon(simulado.title, section);
                                        const color = getSimuladoColor(section);
                                        return (
                                            <Card
                                                key={simulado.title}
                                                className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white h-[320px] w-full group overflow-hidden rounded-xl"
                                            >
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className={`p-3 rounded-xl ${color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                                            <Icon className="h-6 w-6" />
                                                        </div>
                                                    </div>
                                                    <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300">
                                                        {simulado.title}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600 line-clamp-2 h-[48px] mb-3">
                                                        {simulado.description}
                                                    </p>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="space-y-4">
                                                        {/* Botão de editar para rascunhos (apenas professores) */}
                                                        {userRole === 'teacher' && simulado.visibility === QuizVisibility.DRAFT ? (
                                                            <div className="space-y-2">
                                                                <Button
                                                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4"
                                                                    onClick={() => window.location.href = `/pages/simulados/criar-simulados?edit=${simulado.id}`}
                                                                >
                                                                    Editar Rascunho
                                                                    <Edit className="h-5 w-5" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-300 rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-3"
                                                                    onClick={() => handleDetails(simulado.id)}
                                                                >
                                                                    Visualizar
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                className={`w-full ${getStatusColor(simulado.visibility)} transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4`}
                                                                onClick={() => handleDetails(simulado.id)}
                                                            >
                                                                {getStatusText(simulado.visibility)}
                                                                {(() => {
                                                                    const StatusIcon = getStatusIcon(simulado.visibility);
                                                                    return <StatusIcon className="h-5 w-5" />;
                                                                })()}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );


}