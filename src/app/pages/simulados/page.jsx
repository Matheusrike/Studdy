'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, Search, Calculator, Atom, Microscope, Globe, History, BookText, Brain, BookMarked, BookOpen, LineChart, TestTube, Dna, Landmark, BookOpenCheck, BookOpenText, BookOpenIcon, BookOpenCheckIcon, CircleCheck, CircleDashed, CircleOff, Ban, Eye, Edit, Archive, HelpCircle, Clock, CheckCircle, PlayCircle, Play, Users } from "lucide-react";
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
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);

    // Função para buscar simulados do aluno
    const fetchSimulados = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }
            const response = await fetch('http://localhost:3000/student/quizzes', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar simulados');
            }
            const responseData = await response.json();
            setQuiz(responseData.quizzes || []);
        } catch (error) {
            console.error('Erro ao carregar simulados:', error);
            toast.error(error.message || 'Erro ao carregar simulados');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Só busca simulados se não for professor
        if (userRole !== 'teacher') {
            fetchSimulados();
        }
    }, [userRole]);

    if (userRole === 'teacher') {
        // Opcional: pode mostrar um aviso ou redirecionar para /simulados/teacher
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                    <h1 className="text-2xl font-bold text-[#133D86] mb-2">Acesse o painel do professor</h1>
                    <p className="text-gray-600 mb-4">Vá para <b>/simulados/teacher</b> para gerenciar simulados.</p>
                </div>
            </div>
        );
    }

    // Layout de simulados para alunos
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
                    </div>

                    {loading ? (
                        <PageLoader />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {quiz.filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((simulado) => (
                                <Card
                                    key={simulado.id}
                                    className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white h-[320px] w-full group overflow-hidden rounded-xl"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-3 rounded-xl bg-[#133D86] text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    simulado.status === 'completed' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : simulado.status === 'in_progress'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {simulado.status === 'completed' 
                                                        ? 'Concluído'
                                                        : simulado.status === 'in_progress'
                                                        ? 'Em Progresso'
                                                        : 'Disponível'}
                                                </span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300">
                                            {simulado.title}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 line-clamp-2 h-[48px] mb-3">
                                            {simulado.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{simulado.duration_minutes} min</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{simulado.subject?.name}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            <Button
                                                className={`w-full ${
                                                    simulado.status === 'completed'
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : simulado.status === 'in_progress'
                                                        ? 'bg-yellow-600 hover:bg-yellow-700'
                                                        : 'bg-[#133D86] hover:bg-[#0e2a5c]'
                                                } text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4`}
                                                onClick={() => {
                                                    if (simulado.status === 'completed') {
                                                        router.push(`/pages/simulados/${simulado.attempt_id}/result`);
                                                    } else if (simulado.status === 'in_progress') {
                                                        router.push(`/pages/simulados/${simulado.attempt_id}/attempt`);
                                                    } else {
                                                        router.push(`/pages/simulados/${simulado.id}`);
                                                    }
                                                }}
                                            >
                                                {simulado.status === 'completed'
                                                    ? 'Ver Resultados'
                                                    : simulado.status === 'in_progress'
                                                    ? 'Continuar Simulado'
                                                    : 'Iniciar Simulado'}
                                                {simulado.status === 'completed'
                                                    ? <CheckCircle className="h-5 w-5" />
                                                    : simulado.status === 'in_progress'
                                                    ? <PlayCircle className="h-5 w-5" />
                                                    : <Play className="h-5 w-5" />}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}