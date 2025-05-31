"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info, Plus, Trash2, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export default function AdministracaoPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState('teachers');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const types = [
        { id: 'teachers', label: 'Professores' },
        { id: 'students', label: 'Alunos' },
    ];

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Iniciando busca de professores...');

                const response = await fetch('http://localhost:3000/admin/teachers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar professores');
                }

                const teachersData = await response.json();
                console.log('Dados recebidos:', teachersData);

                const formattedTeachers = teachersData.map(teacher => ({
                    id: teacher.id,
                    nome: teacher.user.name,
                    email: teacher.user.email,
                    cpf: teacher.user.cpf,
                    dataNascimento: teacher.user.birth_date ? new Date(teacher.user.birth_date).toLocaleDateString('pt-BR') : 'Não informado',
                    materias: teacher.teacher_subjects.map(ts => ts.subject.name).join(', ')
                }));
                
                setTeachers(formattedTeachers);
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
                setError(error.message || 'Não foi possível carregar os professores');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Iniciando busca de alunos...');

                const response = await fetch('http://localhost:3000/admin/students', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar alunos');
                }

                const studentsData = await response.json();
                console.log('Dados recebidos:', studentsData);

                const formattedStudents = studentsData.map(student => ({
                    id: student.id,
                    nome: student.user.name,
                    email: student.user.email,
                    cpf: student.user.cpf,
                    dataNascimento: student.user.birth_date ? new Date(student.user.birth_date).toLocaleDateString('pt-BR') : 'Não informado',
                    matricula: student.enrollment ,
                    turma: student.class?.name || 'Não informado',
                    curso: student.class?.course || 'Não informado'
                }));
                
                setStudents(formattedStudents);
            } catch (error) {
                console.error('Erro ao buscar alunos:', error);
                setError(error.message || 'Não foi possível carregar os alunos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeachers();
        fetchStudents();
    }, []);

    const filterItems = (items) => {
        if (!items) return [];
        return items.filter(item =>
            (item.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    };

    const currentItems = selectedType === 'teachers' ? filterItems(teachers) : filterItems(students);



    const handleUpdate = async (id, data) => {
        try {
            setIsLoading(true);
            const item = selectedType === 'teachers' 
                ? teachers.find(t => t.id === id)
                : students.find(s => s.id === id);
            
            const endpoint = selectedType === 'teachers' 
                ? `http://localhost:3000/admin/teachers/${id}`
                : `http://localhost:3000/admin/students/${id}`;

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        name: data.nome,
                        email: data.email,
                        cpf: data.cpf,
                        birth_date: data.dataNascimento
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar ${selectedType === 'teachers' ? 'professor' : 'aluno'}`);
            }

            const updatedData = await response.json();
            
            if (selectedType === 'teachers') {
                const updatedTeacher = {
                    ...item,
                    nome: updatedData.user.name,
                    email: updatedData.user.email,
                    cpf: updatedData.user.cpf,
                    dataNascimento: updatedData.user.birth_date ? new Date(updatedData.user.birth_date).toLocaleDateString('pt-BR') : 'Não informado',
                    materias: updatedData.teacher_subjects.map(ts => ts.subject.name).join(', ')
                };
                setTeachers(prev => prev.map(t => t.id === id ? updatedTeacher : t));
            } else {
                const updatedStudent = {
                    ...item,
                    nome: updatedData.user.name,
                    email: updatedData.user.email,
                    cpf: updatedData.user.cpf,
                    dataNascimento: updatedData.user.birth_date ? new Date(updatedData.user.birth_date).toLocaleDateString('pt-BR') : 'Não informado',
                    matricula: updatedData.enrollment,
                    turma: updatedData.class.name,
                    curso: updatedData.class.course
                };
                setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
            }

            setIsEditModalOpen(false);
            toast.success(`${selectedType === 'teachers' ? 'Professor' : 'Aluno'} atualizado com sucesso!`);
        } catch (error) {
            console.error(`Erro ao atualizar ${selectedType === 'teachers' ? 'professor' : 'aluno'}:`, error);
            toast.error(`Erro ao atualizar ${selectedType === 'teachers' ? 'professor' : 'aluno'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(`Tem certeza que deseja excluir este ${selectedType === 'teachers' ? 'professor' : 'aluno'}?`)) {
            return;
        }

        try {
            setIsLoading(true);
            const endpoint = selectedType === 'teachers' 
                ? `http://localhost:3000/admin/teachers/${id}`
                : `http://localhost:3000/admin/students/${id}`;

            const response = await fetch(endpoint, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir ${selectedType === 'teachers' ? 'professor' : 'aluno'}`);
            }

            if (selectedType === 'teachers') {
                setTeachers(prev => prev.filter(t => t.id !== id));
            } else {
                setStudents(prev => prev.filter(s => s.id !== id));
            }

            toast.success(`${selectedType === 'teachers' ? 'Professor' : 'Aluno'} excluído com sucesso!`);
        } catch (error) {
            console.error(`Erro ao excluir ${selectedType === 'teachers' ? 'professor' : 'aluno'}:`, error);
            toast.error(`Erro ao excluir ${selectedType === 'teachers' ? 'professor' : 'aluno'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetails = (id) => {
        const item = selectedType === 'teachers' 
            ? teachers.find(teacher => teacher.id === id)
            : students.find(student => student.id === id);
        setSelectedItem(item);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Administração</CardTitle>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        
                    </div>
                </CardHeader>
                <div className="px-6 flex flex-wrap gap-2">
                    {types.map((type) => (
                        <Button
                            key={type.id}
                            variant={selectedType === type.id ? "default" : "outline"}
                            className="text-sm"
                            onClick={() => setSelectedType(type.id)}
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    {selectedType === 'teachers' ? (
                                        <TableHead>Matérias</TableHead>
                                    ) : (
                                        <TableHead>Turma</TableHead>
                                    )}
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.nome}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        {selectedType === 'teachers' ? (
                                            <TableCell>{item.materias?.split(', ').map(materia => 
                                                materia.charAt(0).toUpperCase() + materia.slice(1)
                                            ).join(', ')}</TableCell>
                                        ) : (
                                            <TableCell>{item.turma}</TableCell>
                                        )}
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDetails(item.id)}
                                            >
                                                <Info className="h-4 w-4 mr-2" />
                                                Detalhes
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Criação/Edição */}
            <Dialog open={isEditModalOpen || isCreateModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                setIsCreateModalOpen(open);
                if (!open) setSelectedItem(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isCreateModalOpen ? 'Adicionar' : 'Editar'} {selectedType === 'teachers' ? 'Professor' : 'Aluno'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nome" className="text-right">
                                Nome
                            </Label>
                            <Input
                                id="nome"
                                value={selectedItem?.nome || ""}
                                onChange={(e) => setSelectedItem(prev => ({ ...prev, nome: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={selectedItem?.email || ""}
                                onChange={(e) => setSelectedItem(prev => ({ ...prev, email: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cpf" className="text-right">
                                CPF
                            </Label>
                            <Input
                                id="cpf"
                                value={selectedItem?.cpf || ""}
                                onChange={(e) => setSelectedItem(prev => ({ ...prev, cpf: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dataNascimento" className="text-right">
                                Data de Nascimento
                            </Label>
                            <Input
                                id="dataNascimento"
                                type="date"
                                value={selectedItem?.dataNascimento && selectedItem.dataNascimento !== 'Não informado' 
                                    ? new Date(selectedItem.dataNascimento.split('/').reverse().join('-')).toISOString().split('T')[0] 
                                    : ""}
                                onChange={(e) => setSelectedItem(prev => ({ ...prev, dataNascimento: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsEditModalOpen(false);
                            setIsCreateModalOpen(false);
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={() => {
                            if (isCreateModalOpen) {
                                handleCreate(selectedItem);
                            } else {
                                handleUpdate(selectedItem.id, selectedItem);
                            }
                        }}>
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Detalhes */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="max-w-3xl w-full" aria-describedby="descricao-modal">
                    <p id="descricao-modal" className="sr-only">
                        Modal com detalhes completos do {selectedType === 'teachers' ? 'professor' : 'aluno'} selecionado.
                    </p>
                    <DialogHeader>
                        <DialogTitle>Detalhes do {selectedType === 'teachers' ? 'Professor' : 'Aluno'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nome Completo</Label>
                            <p className="text-sm text-muted-foreground">{selectedItem?.nome || 'Não informado'}</p>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <p className="text-sm text-muted-foreground">{selectedItem?.email || 'Não informado'}</p>
                        </div>
                        <div>
                            <Label>CPF</Label>
                            <p className="text-sm text-muted-foreground">{selectedItem?.cpf || 'Não informado'}</p>
                        </div>
                        <div>
                            <Label>Data de Nascimento</Label>
                            <p className="text-sm text-muted-foreground">{selectedItem?.dataNascimento || 'Não informado'}</p>
                        </div>
                        {selectedType === 'teachers' ? (
                            <div className="grid grid-cols-2 gap-4 col-span-2">
                                <div>
                                    <Label>Matérias</Label>
                                    <p className="text-sm text-muted-foreground">{selectedItem?.materias?.charAt(0).toUpperCase() + selectedItem?.materias?.slice(1) || 'Não informado'}</p>
                                </div>
                                <div>
                                    <Label>Turmas</Label>
                                    <p className="text-sm text-muted-foreground">{selectedItem?.turmas?.charAt(0).toUpperCase() + selectedItem?.turmas?.slice(1) || 'Não informado'}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <Label>Matrícula</Label>
                                    <p className="text-sm text-muted-foreground">{selectedItem?.matricula}</p>
                                </div>
                                <div>
                                    <Label>Turma</Label>
                                    <p className="text-sm text-muted-foreground">{selectedItem?.turma || 'Não informado'}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label>Curso</Label>
                                    <p className="text-sm text-muted-foreground">{selectedItem?.curso || 'Não informado'}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 
