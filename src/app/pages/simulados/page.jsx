'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, Search, Calculator, Atom, Microscope, Globe, History, BookText, Brain, BookMarked, BookOpen, LineChart, TestTube, Dna, Landmark, BookOpenCheck, BookOpenText, BookOpenIcon, BookOpenCheckIcon, CircleCheck, CircleDashed, CircleOff, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";

const quiz = {
    exatas: [
        {
            id: 1,
            title: "Matemática Básica",
            max_points: "Fundamentos de matemática com foco em álgebra e geometria",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        },
        {
            id: 2,
            title: "Matemática Avançada",
            max_points: "Cálculo, trigonometria e geometria analítica",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        },
        {
            id: 3,
            title: "Física Mecânica",
            max_points: "Mecânica clássica e termodinâmica",
            date: "Disponível",
            visibility: "concluido"
        },
        {
            id: 4,
            title: "Física Moderna",
            max_points: "Relatividade e física quântica",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        },
        {
            id: 5,
            title: "Química Geral",
            max_points: "Fundamentos e reações químicas",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        },
        {
            id: 6,
            title: "Química Orgânica",
            max_points: "Compostos orgânicos e reações",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        }
    ],
    humanas: [
        {
            id: 7,
            title: "História do Brasil",
            max_points: "Períodos coloniais e república",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        },
        {
            id: 8,
            title: "História Geral",
            max_points: "História antiga e contemporânea",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        },
        {
            id: 9,
            title: "Geografia Física",
            max_points: "Relevo, clima e hidrografia",
            date: "Disponível",
            visibility: "expirado"
        },
        {
            id: 10,
            title: "Geografia Humana",
            max_points: "População, urbanização e economia",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        }
    ],
    linguagens: [
        {
            id: 11,
            title: "Português - Gramática",
            max_points: "Morfologia, sintaxe e semântica",
            date: "Disponível",
            visibility: "concluido"
        },
        {
            id: 12,
            title: "Literatura Brasileira",
            max_points: "Principais obras e autores brasileiros",
            date: "Disponível",
            visibility: "expirado"
        },
        {
            id: 13,
            title: "Literatura Portuguesa",
            max_points: "Autores e obras da literatura portuguesa",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        }
    ],
    biologicas: [
        {
            id: 14,
            title: "Biologia Celular",
            max_points: "Células, tecidos e sistemas",
            date: "Disponível",
            visibility: "concluido"
        },
        {
            id: 15,
            title: "Genética",
            max_points: "Hereditariedade e evolução",
            date: "Disponível",
            visibility: "concluido"
        },
        {
            id: 16,
            title: "Ecologia",
            max_points: "Ecossistemas e meio ambiente",
            date: "Disponível",
            visibility: "pendente",
            teacher_subject_class_id: 1,
        }
    ]
};

const statusVisibility = [
    { id: 'todos', label: 'Todos' },
    { id: 'pendente', label: 'Pendentes' },
    { id: 'concluido', label: 'Concluídos' },
    { id: 'expirado', label: 'Expirados' }
];

export default function SimuladosPage() {
    const { userRole } = useUser();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [selectedVisibility, setSelectedVisibility] = useState('todos');
    const [favorites, setFavorites] = useState([]);

    const handleDetails = (simuladoId) => {
        router.push(`/pages/simulados/${simuladoId}`);
    };

    useEffect(() => {
        const savedFavorites = localStorage.getItem('simulados_favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
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
        switch (visibility) {
            case 'pendente':
                return 'bg-[#133D86] hover:bg-[#0e2a5c]';
            case 'concluido':
                return 'bg-green-700 hover:bg-green-600';
            case 'expirado':
                return 'bg-red-700 hover:bg-red-600';
            default:
                return 'bg-[#133D86] hover:bg-[#0e2a5c]';
        }
    };

    const getStatusText = (visibility) => {
        switch (visibility) {
            case 'pendente':
                return 'Pendentes';
            case 'concluido':
                return 'Concluído';
            case 'expirado':
                return 'Expirado';
            default:
                return 'Ver Simulado';
        }
    };

    const getStatusIcon = (visibility) => {
        switch (visibility) {
            case 'pendente':
                return CircleDashed;
            case 'concluido':
                return CircleCheck;
            case 'expirado':
                return Ban;
            default:
                return CircleDashed;
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
                                                className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white h-[280px] w-full group overflow-hidden"
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className={`p-2.5 rounded-xl ${color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                    <CardTitle className="text-lg mt-3 h-[28px] line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300 font-semibold">{simulado.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-gray-600 mb-4 h-[40px] line-clamp-2 text-sm">{simulado.max_points}</p>
                                                    <Button
                                                        className={`w-full ${getStatusColor(simulado.visibility)} transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-2`}
                                                        onClick={() => handleDetails(simulado.id)}
                                                    >
                                                        {getStatusText(simulado.visibility)}
                                                        {(() => {
                                                            const StatusIcon = getStatusIcon(simulado.visibility);
                                                            return <StatusIcon className="h-4 w-4" />;
                                                        })()}
                                                    </Button>

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