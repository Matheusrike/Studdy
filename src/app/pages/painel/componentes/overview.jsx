'use client';

import { FileText, CheckCircle, LineChart } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function Overview() {
    const { userRole } = useUser();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Buscar dados do estudante da API
    useEffect(() => {
        if (userRole === 'student') {
            setLoading(true);
            fetch('http://localhost:3000/student/status')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Falha ao buscar dados do estudante');
                    }
                    return response.json();
                })
                .then(data => {
                    setStudentData(data);
                    setError(null);
                })
                .catch(err => {
                    setError(err.message);
                    console.error('Erro ao buscar dados do estudante:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [userRole]);

    // Função para gerar dados do dashboard do aluno
    const getDashAlunos = () => {
        if (loading) {
            return [
                {
                    title: 'Simulados Realizados',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <FileText className="h-6 w-6 text-primary" />,
                    iconBg: 'bg-primary/10',
                    textColor: 'text-primary'
                },
                {
                    title: 'Média de Acertos',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-600'
                },
                {
                    title: 'Tempo de Estudo',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <LineChart className="h-6 w-6 text-blue-600" />,
                    iconBg: 'bg-blue-100',
                    textColor: 'text-blue-600'
                }
            ];
        }

        if (error) {
            return [
                {
                    title: 'Simulados Realizados',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <FileText className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                },
                {
                    title: 'Média de Acertos',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <CheckCircle className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                },
                {
                    title: 'Tempo de Estudo',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <LineChart className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                }
            ];
        }

        if (studentData) {
            return [
                {
                    title: 'Simulados Realizados',
                    value: studentData.completedQuizzes,
                    subtitle: `${studentData.availableQuizzes} disponíveis`,
                    icon: <FileText className="h-6 w-6 text-primary" />,
                    iconBg: 'bg-primary/10',
                    textColor: 'text-primary'
                },
                {
                    title: 'Média de Acertos',
                    value: `${studentData.averageCorrectResponses}%`,
                    subtitle: `${studentData.completionPercentageOverall}% concluído`,
                    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-600'
                },
                {
                    title: 'Tempo de Estudo',
                    value: `${Math.floor(studentData.totalTimeSpentMinutes / 60)}h ${studentData.totalTimeSpentMinutes % 60}m`,
                    subtitle: 'Total acumulado',
                    icon: <LineChart className="h-6 w-6 text-blue-600" />,
                    iconBg: 'bg-blue-100',
                    textColor: 'text-blue-600'
                }
            ];
        }

        // Dados padrão caso não haja dados da API
        return [
            {
                title: 'Simulados Realizados',
                value: 0,
                subtitle: 'Nenhum simulado realizado',
                icon: <FileText className="h-6 w-6 text-primary" />,
                iconBg: 'bg-primary/10',
                textColor: 'text-primary'
            },
            {
                title: 'Média de Acertos',
                value: '0%',
                subtitle: 'Sem dados disponíveis',
                icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                iconBg: 'bg-green-100',
                textColor: 'text-green-600'
            },
            {
                title: 'Tempo de Estudo',
                value: '0h',
                subtitle: 'Sem tempo registrado',
                icon: <LineChart className="h-6 w-6 text-blue-600" />,
                iconBg: 'bg-blue-100',
                textColor: 'text-blue-600'
            }
        ];
    };

    const dashProfessor = [
        {
            title: 'Alunos Ativos',
            value: 45,
            subtitle: '+5 este mês',
            icon: <FileText className="h-6 w-6 text-primary" />,
            iconBg: 'bg-primary/10',
            textColor: 'text-primary'
        },
        {
            title: 'Média da Turma',
            value: '82%',
            subtitle: '+3% este mês',
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            iconBg: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'Atividades Pendentes',
            value: 8,
            subtitle: 'Para corrigir',
            icon: <LineChart className="h-6 w-6 text-blue-600" />,
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-600'
        }
    ];

    const dashAdmin = [
        {
            title: 'Total Users',
            value: 154,
            subtitle: '+10 this week',
            icon: <FileText className="h-6 w-6 text-primary" />,
            iconBg: 'bg-primary/10',
            textColor: 'text-primary'
        },
        {
            title: 'Active Professors',
            value: 18,
            subtitle: '3 new this month',
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            iconBg: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'System Uptime',
            value: '99.9%',
            subtitle: 'Stable this month',
            icon: <LineChart className="h-6 w-6 text-blue-600" />,
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-600'
        }
    ];

    // Seleciona o dashboard com base no papel
    const dashData =
        userRole === 'professor'
            ? dashProfessor
            : userRole === 'admin'
                ? dashAdmin
                : getDashAlunos();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashData.map((item, index) => (
                <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground text-lg">{item.title}</span>
                            <div className={`p-2 rounded-lg ${item.iconBg}`}>
                                {item.icon}
                            </div>
                        </div>
                        <p className={`text-4xl font-bold ${item.textColor}`}>{item.value}</p>
                        <p className="text-sm text-muted-foreground mt-2">{item.subtitle}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}