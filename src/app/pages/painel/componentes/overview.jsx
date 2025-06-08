'use client';

import { FileText, CheckCircle, LineChart, Users } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Overview() {
    const { userRole } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Buscar dados baseado na role do usuário
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) return;

        setLoading(true);
        let endpoint = '';

        switch (userRole) {
            case 'student':
                endpoint = 'http://localhost:3000/student/status';
                break;
            case 'teacher':
                endpoint = 'http://localhost:3000/teacher/status';
                break;
            case 'admin':
                endpoint = 'http://localhost:3000/admin/status';
                break;
            default:
                setLoading(false);
                return;
        }

        fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                console.error('Erro ao buscar dados:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userRole]);

    // Função para gerar dados do dashboard do aluno
    const getDashAlunos = () => {
        if (loading) {
            return [
                {
                    title: 'Quizzes Disponíveis',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <FileText className="h-6 w-6 text-purple-600" />,
                    iconBg: 'bg-purple-100',
                    textColor: 'text-purple-600'
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
                    title: 'Quizzes Disponíveis',
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

        if (data) {
            return [
                {
                    title: 'Simulados Disponíveis',
                    value: data.availableQuizzes,
                    subtitle: data.availableQuizzes === 0 ? 'Parabéns! Você completou todos os simulados disponíveis!' : 'Vamos resolver mais simulados?',
                    icon: <FileText className="h-6 w-6 text-purple-600" />,
                    iconBg: 'bg-purple-100',
                    textColor: 'text-purple-600'
                },
                {
                    title: 'Média de Acertos',
                    value: `${data.averageCorrectResponses}%`,
                    subtitle: `${data.completionPercentageOverall}% concluído`,
                    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-600'
                },
                {
                    title: 'Tempo de Estudo',
                    value: `${Math.floor(data.totalTimeSpentMinutes / 60)}h ${data.totalTimeSpentMinutes % 60}m`,
                    subtitle: 'Total acumulado',
                    icon: <LineChart className="h-6 w-6 text-blue-600" />,
                    iconBg: 'bg-blue-100',
                    textColor: 'text-blue-600'
                }
            ];
        }

        return [
            {
                title: 'Simulados Disponíveis',
                value: 0,
                subtitle: 'Sem simulados disponíveis',
                icon: <FileText className="h-6 w-6 text-purple-600" />,
                iconBg: 'bg-purple-100',
                textColor: 'text-purple-600'
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

    const getDashProfessor = () => {
        if (loading) {
            return [
                {
                    title: 'Total de Alunos',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <Users className="h-6 w-6 text-primary" />,
                    iconBg: 'bg-primary/10',
                    textColor: 'text-primary'
                },
                {
                    title: 'Taxa de Conclusão',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-600'
                },
                {
                    title: 'Média da Turma',
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
                    title: 'Total de Alunos',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <Users className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                },
                {
                    title: 'Taxa de Conclusão',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <CheckCircle className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                },
                {
                    title: 'Média da Turma',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <LineChart className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                }
            ];
        }

        if (data) {
            return [
                {
                    title: 'Total de Alunos',
                    value: data.totalStudents,
                    subtitle: 'Alunos ativos',
                    icon: <Users className="h-6 w-6 text-primary" />,
                    iconBg: 'bg-primary/10',
                    textColor: 'text-primary'
                },
                {
                    title: 'Taxa de Conclusão',
                    value: `${data.quizCompletionRate}%`,
                    subtitle: 'Quizzes concluídos pelos alunos',
                    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-600'
                },
                {
                    title: 'Média da Geral de Acertos',
                    value: `${data.classAverageScoreGlobal}`,
                    subtitle: 'Pontuação média',
                    icon: <LineChart className="h-6 w-6 text-blue-600" />,
                    iconBg: 'bg-blue-100',
                    textColor: 'text-blue-600'
                }
            ];
        }

        return [
            {
                title: 'Total de Alunos',
                value: 0,
                subtitle: 'Sem alunos registrados',
                icon: <Users className="h-6 w-6 text-primary" />,
                iconBg: 'bg-primary/10',
                textColor: 'text-primary'
            },
            {
                title: 'Taxa de Conclusão',
                value: '0%',
                subtitle: 'Sem dados disponíveis',
                icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                iconBg: 'bg-green-100',
                textColor: 'text-green-600'
            },
            {
                title: 'Média da Turma',
                value: '0',
                subtitle: 'Sem pontuações registradas',
                icon: <LineChart className="h-6 w-6 text-blue-600" />,
                iconBg: 'bg-blue-100',
                textColor: 'text-blue-600'
            }
        ];
    };

    const getDashAdmin = () => {
        if (loading) {
            return [
                {
                    title: 'Total de Usuários',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <Users className="h-6 w-6 text-primary" />,
                    iconBg: 'bg-primary/10',
                    textColor: 'text-primary'
                },
                {
                    title: 'Total de Professores',
                    value: '...',
                    subtitle: 'Carregando...',
                    icon: <FileText className="h-6 w-6 text-green-600" />,
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-600'
                },
                {
                    title: 'Total de Alunos',
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
                    title: 'Total de Usuários',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <Users className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                },
                {
                    title: 'Total de Professores',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <FileText className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                },
                {
                    title: 'Total de Alunos',
                    value: 'Erro',
                    subtitle: 'Falha ao carregar dados',
                    icon: <LineChart className="h-6 w-6 text-red-600" />,
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-600'
                }
            ];
        }

        if (data) {
            return [
                {
                    title: 'Total de Usuários',
                    value: data.totalUsers,
                    subtitle: 'Usuários ativos',
                    icon: <Users className="h-6 w-6 text-primary" />,
                    iconBg: 'bg-primary/10',
                    textColor: 'text-primary'
                },
                {
                    title: 'Total de Professores',
                    value: data.totalTeachers,
                    subtitle: 'Professores ativos',
                    icon: <FileText className="h-6 w-6 text-green-600" />,
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-600'
                },
                {
                    title: 'Total de Alunos',
                    value: data.totalStudents,
                    subtitle: 'Alunos ativos',
                    icon: <LineChart className="h-6 w-6 text-blue-600" />,
                    iconBg: 'bg-blue-100',
                    textColor: 'text-blue-600'
                }
            ];
        }

        return [
            {
                title: 'Total de Usuários',
                value: 0,
                subtitle: 'Sem usuários registrados',
                icon: <Users className="h-6 w-6 text-primary" />,
                iconBg: 'bg-primary/10',
                textColor: 'text-primary'
            },
            {
                title: 'Total de Professores',
                value: 0,
                subtitle: 'Sem professores registrados',
                icon: <FileText className="h-6 w-6 text-green-600" />,
                iconBg: 'bg-green-100',
                textColor: 'text-green-600'
            },
            {
                title: 'Total de Alunos',
                value: 0,
                subtitle: 'Sem alunos registrados',
                icon: <LineChart className="h-6 w-6 text-blue-600" />,
                iconBg: 'bg-blue-100',
                textColor: 'text-blue-600'
            }
        ];
    };

    // Seleciona o dashboard com base no papel
    const dashData =
        userRole === 'teacher'
            ? getDashProfessor()
            : userRole === 'admin'
                ? getDashAdmin()
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