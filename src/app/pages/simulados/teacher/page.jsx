'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Users, Plus, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Sidebar } from "@/components/ui/sidebar";

export default function TeacherSimuladosPage() {
    const { userRole } = useUser();
    const router = useRouter();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userRole !== 'Teacher') {
            router.push('/pages/simulados');
            return;
        }
        fetchClasses();
    }, [userRole]);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch('http://localhost:3000/teacher/classes', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar turmas');
            }

            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Erro ao carregar turmas:', error);
            toast.error(error.message || 'Erro ao carregar turmas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Sidebar />
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Gerenciar Simulados</h1>
                        <p className="mt-2 text-center text-gray-600">Selecione uma turma para gerenciar seus simulados</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {classes.map((classItem) => (
                            <Card
                                key={classItem.class_id}
                                className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white group overflow-hidden rounded-xl"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 rounded-xl bg-[#133D86] text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
                                            <Users className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300">
                                        {classItem.class_name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {classItem.class_course} • {classItem.class_shift}
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Button
                                        className="w-full bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4"
                                        onClick={() => router.push(`/pages/simulados/teacher/classes/${classItem.class_id}`)}
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        Gerenciar Simulados
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