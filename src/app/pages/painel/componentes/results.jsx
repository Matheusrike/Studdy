
'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function Results() {
    const { userRole } = useUser();

    // Dados específicos para cada tipo de usuário
    const getResultsData = () => {
        switch (userRole) {
            case 'professor':
            case 'Teacher':
                return {
                    title: 'Atividades Recentes da Turma',
                    buttonText: 'Ver todas as atividades',
                    headers: ['Atividade', 'Turma', 'Média', 'Status'],
                    data: [
                        {
                            name: 'Simulado de Química',
                            detail: '3º Ano A',
                            score: '78%',
                            status: 'Concluído',
                            statusColor: 'bg-green-100 text-green-800'
                        },
                        {
                            name: 'Prova de Física',
                            detail: '2º Ano B',
                            score: '82%',
                            status: 'Concluído',
                            statusColor: 'bg-green-100 text-green-800'
                        },
                        {
                            name: 'Exercícios de Matemática',
                            detail: '1º Ano C',
                            score: '65%',
                            status: 'Pendente',
                            statusColor: 'bg-yellow-100 text-yellow-800'
                        }
                    ]
                };
            case 'Admin':
                return {
                    title: 'Atividades do Sistema',
                    buttonText: 'Ver relatório completo',
                    headers: ['Atividade', 'Usuário', 'Tipo', 'Status'],
                    data: [
                        {
                            name: 'Novo usuário cadastrado',
                            detail: 'João Silva',
                            score: 'Professor',
                            status: 'Ativo',
                            statusColor: 'bg-green-100 text-green-800'
                        },
                        {
                            name: 'Simulado criado',
                            detail: 'Maria Santos',
                            score: 'Química',
                            status: 'Publicado',
                            statusColor: 'bg-blue-100 text-blue-800'
                        },
                        {
                            name: 'Backup do sistema',
                            detail: 'Sistema',
                            score: 'Automático',
                            status: 'Concluído',
                            statusColor: 'bg-green-100 text-green-800'
                        }
                    ]
                };
            default: // student
                return {
                    title: 'Resultados Recentes',
                    buttonText: 'Ver todos os resultados',
                    headers: ['Simulado', 'Data', 'Nota', 'Status'],
                    data: [
                        {
                            name: 'Simulado de Química',
                            detail: '27/05/2025',
                            score: '85%',
                            status: 'Aprovado',
                            statusColor: 'bg-green-100 text-green-800'
                        },
                        {
                            name: 'Simulado de Física',
                            detail: '17/06/2025',
                            score: '72%',
                            status: 'Aprovado',
                            statusColor: 'bg-green-100 text-green-800'
                        },
                        {
                            name: 'Simulado de Português',
                            detail: '08/07/2025',
                            score: '68%',
                            status: 'Revisão',
                            statusColor: 'bg-yellow-100 text-yellow-800'
                        }
                    ]
                };
        }
    };

    const { title, buttonText, headers, data } = getResultsData();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button variant="outline" className="gap-2">
                    {buttonText}
                </Button>
            </div>
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                {headers.map((header, index) => (
                                    <TableHead key={index} className="font-semibold">{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.detail}</TableCell>
                                    <TableCell className="font-semibold text-green-600">{item.score}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`w-20 hover:${item.statusColor} px-3 py-1 ${item.statusColor}`}
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}