'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Search, Plus, Calculator, Atom, Pen, ScrollText, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { QuizVisibility, getVisibilityText, getVisibilityColor } from '../../../enums/QuizVisibility';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const statusVisibility = [
    { value: 'todos', label: 'Todos' },
    { value: 'public', label: 'Público' },
    { value: 'private', label: 'Privado' },
    { value: 'draft', label: 'Rascunho' },
];

export default function ClassDetailsClient({ classId }) {
    const router = useRouter();
    const { userRole } = useUser();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVisibility, setSelectedVisibility] = useState('todos');
    const [quizToDelete, setQuizToDelete] = useState(null);

    useEffect(() => {
        if (userRole !== 'Teacher') {
            router.push('/pages/simulados');
            return;
        }
        fetchClassData();
    }, [userRole, classId]);

    const fetchClassData = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch(`http://localhost:3000/teacher/classes/${classId}`, {
                method: 'GET',
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

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'Calculator':
                return <Calculator className="h-6 w-6" />;
            case 'Atom':
                return <Atom className="h-6 w-6" />;
            case 'Pen':
                return <Pen className="h-6 w-6" />;
            case 'ScrollText':
                return <ScrollText className="h-6 w-6" />;
            default:
                return <Calculator className="h-6 w-6" />;
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

    const handleDeleteQuiz = async (quiz) => {
        toast.promise(
            (async () => {
                const token = Cookies.get('token');
                if (!token) {
                    throw new Error('Token não encontrado');
                }

                const response = await fetch(`http://localhost:3000/teacher/quiz/${quiz.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erro ao deletar simulado');
                }

                await fetchClassData(); // Recarrega os dados
                return 'Simulado deletado com sucesso';
            })(),
            {
                loading: 'Deletando simulado...',
                success: (message) => message,
                error: (error) => error.message || 'Erro ao deletar simulado'
            }
        );
        setQuizToDelete(null);
    };

    if (loading) return <PageLoader />;
    if (!classData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">{classData.name}</h1>
                        <p className="mt-2 text-center text-gray-600">{classData.course} • {classData.shift === 'Morning' ? 'Manhã' : classData.shift === 'Afternoon' ? 'Tarde' : 'Noite'}</p>
                    </div>

                    <div className="mb-8 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Buscar simulados..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {statusVisibility.map((status) => (
                                <Button
                                    key={status.value}
                                    variant={selectedVisibility === status.value ? "default" : "outline"}
                                    className="text-sm"
                                    onClick={() => setSelectedVisibility(status.value)}
                                >
                                    {status.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filterItems(classData.quizzes).map((quiz) => (
                            <Card
                                key={quiz.id}
                                className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white group overflow-hidden rounded-xl"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 rounded-xl bg-[#133D86] text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
                                            {getIconComponent(quiz.icon)}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => setQuizToDelete(quiz)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300">
                                        {quiz.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {quiz.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">
                                            Duração: {quiz.duration_minutes} min
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisibilityColor(quiz.visibility)}`}>
                                            {getVisibilityText(quiz.visibility)}
                                        </span>
                                    </div>
                                    <Button
                                        className="w-full bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4"
                                        onClick={() => router.push(`/pages/simulados/teacher/editar-simulado/${quiz.id}`)}
                                    >
                                        Gerenciar Simulado
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Deletar Simulado
                        </DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja deletar o simulado "{quizToDelete?.title}"? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setQuizToDelete(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteQuiz(quizToDelete)}
                        >
                            Deletar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 