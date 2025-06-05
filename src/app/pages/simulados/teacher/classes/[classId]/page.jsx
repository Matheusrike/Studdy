'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Search, Calculator, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { QuizVisibility, getVisibilityText, getVisibilityColor } from '../../../enums/QuizVisibility';
import { Sidebar } from "@/components/ui/sidebar";

const statusVisibility = [
    { id: 'todos', label: 'Todos' },
    { id: QuizVisibility.DRAFT, label: 'Rascunho' },
    { id: QuizVisibility.PUBLIC, label: 'Público' },
    { id: QuizVisibility.ARCHIVED, label: 'Arquivado' }
];

export default function ClassSimuladosPage({ params }) {
    const { userRole } = useUser();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVisibility, setSelectedVisibility] = useState('todos');
    const [loading, setLoading] = useState(false);
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        if (userRole !== 'teacher') {
            router.push('/pages/simulados');
            return;
        }
        fetchClassData();
    }, [userRole, params.classId]);

    const fetchClassData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch(`http://localhost:3000/teacher/classes/${params.classId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar dados da turma');
            }

            const data = await response.json();
            setClassData(data);
        } catch (error) {
            console.error('Erro ao carregar dados da turma:', error);
            toast.error(error.message || 'Erro ao carregar dados da turma');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!confirm('Tem certeza que deseja excluir este simulado?')) return;

        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch(`http://localhost:3000/teacher/classes/${params.classId}/quizzes/${quizId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao excluir simulado');
            }

            toast.success('Simulado excluído com sucesso!');
            fetchClassData();
        } catch (error) {
            console.error('Erro ao excluir simulado:', error);
            toast.error(error.message || 'Erro ao excluir simulado');
        }
    };

    const filterItems = (items) => {
        return items.filter(item => {
            const matchesSearch = (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesVisibility = selectedVisibility === 'todos' || item.visibility === selectedVisibility;
            return matchesSearch && matchesVisibility;
        });
    };

    if (loading) return <PageLoader />;
    if (!classData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Sidebar />
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">{classData.name}</h1>
                        <p className="mt-2 text-center text-gray-600">{classData.course} • {classData.shift}</p>
                    </div>

                    <div className="mb-8 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Buscar Simulados..."
                                    className="pl-10 w-full h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={() => router.push(`/pages/simulados/teacher/criar-simulados?classId=${params.classId}`)}
                                className="bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center gap-2 py-4 px-6"
                            >
                                <Plus className="h-5 w-5" />
                                Criar Novo Simulado
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {statusVisibility.map((visibility) => (
                                <Button
                                    key={visibility.id}
                                    variant={selectedVisibility === visibility.id ? "default" : "outline"}
                                    className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                                        selectedVisibility === visibility.id
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filterItems(classData.quizzes).map((simulado) => (
                            <Card
                                key={simulado.id}
                                className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white group overflow-hidden rounded-xl"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 rounded-xl bg-[#133D86] text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
                                            <Calculator className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs ${getVisibilityColor(simulado.visibility)}`}>
                                                {getVisibilityText(simulado.visibility)}
                                            </span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300">
                                        {simulado.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {simulado.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2">
                                        <Button
                                            className="w-full bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-2 py-3"
                                            onClick={() => router.push(`/pages/simulados/teacher/criar-simulados?classId=${params.classId}&quizId=${simulado.id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                            Editar Simulado
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-2 py-3"
                                            onClick={() => handleDeleteQuiz(simulado.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Excluir Simulado
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 