'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Search, Plus, Calculator, Atom, Pen, ScrollText, Trash2, Users, BookOpen, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { QuizVisibility, getVisibilityText, getVisibilityColor } from '../../enums/QuizVisibility';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizResults from './quiz-results';

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
    const [activeTab, setActiveTab] = useState("simulados");
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        if (userRole !== 'teacher') {
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
        if (!items) return [];
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

                await fetchClassData();
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

                    {selectedQuiz ? (
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="mb-4"
                                onClick={() => setSelectedQuiz(null)}
                            >
                                Voltar para Simulados
                            </Button>
                            <QuizResults classId={classId} quizId={selectedQuiz.id} />
                        </div>
                    ) : (
                        <Tabs defaultValue="simulados" className="w-full" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="simulados" className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Simulados
                                </TabsTrigger>
                                <TabsTrigger value="informacoes" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Informações
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="simulados">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="Buscar simulados..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8"
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
                                                <div className="flex gap-2">
                                                    <Button
                                                        className="flex-1 bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4"
                                                        onClick={() => router.push(`/pages/turmas/teacher/editar-simulado/${quiz.id}`)}
                                                    >
                                                        Gerenciar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2"
                                                        onClick={() => setSelectedQuiz(quiz)}
                                                    >
                                                        <BarChart2 className="h-4 w-4" />
                                                        Resultados
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="informacoes">
                                <div className="space-y-8">
                                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Users className="h-6 w-6 text-[#133D86]" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">Professores</h2>
                                                <p className="text-sm text-gray-500">Professores responsáveis pela turma</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {classData.teachers?.map((teacher) => (
                                                <div key={teacher.teacher_id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-[#133D86] transition-colors duration-300">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-[#133D86] rounded-full text-white">
                                                            <Users className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900">{teacher.teacher_name}</h3>
                                                            <p className="text-sm text-gray-600">{teacher.teacher_email}</p>
                                                            <div className="mt-3">
                                                                <p className="text-sm font-medium text-gray-700 mb-1">Disciplinas:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {teacher.subjects.map(subject => (
                                                                        <span key={subject.id} className="px-2 py-1 bg-blue-50 text-[#133D86] rounded-full text-xs font-medium">
                                                                            {subject.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Users className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">Alunos</h2>
                                                <p className="text-sm text-gray-500">Alunos matriculados na turma</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {classData.students?.map((student) => (
                                                <div key={student.student_id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-green-500 transition-colors duration-300">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-green-500 rounded-full text-white">
                                                            <Users className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900">{student.name}</h3>
                                                            <p className="text-sm text-gray-600">{student.email}</p>
                                                            <div className="mt-2">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Matrícula: {student.enrollment}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <BookOpen className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">Informações da Turma</h2>
                                                <p className="text-sm text-gray-500">Detalhes gerais da turma</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Nome da Turma</h3>
                                                <p className="text-lg font-semibold text-gray-900">{classData.name}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Curso</h3>
                                                <p className="text-lg font-semibold text-gray-900">{classData.course}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Turno</h3>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {classData.shift === 'Morning' ? 'Manhã' : classData.shift === 'Afternoon' ? 'Tarde' : 'Noite'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
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