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
    const [selectedType, setSelectedType] = useState('professores');
    const [professores, setProfessores] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const types = [
        { id: 'professores', label: 'Professores' },
        { id: 'alunos', label: 'Alunos' },
    ];

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Iniciando busca de professores...');

                const response = await fetch('http://localhost:3001/admin/teachers ', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                console.log('Resposta recebida:', response.status);

                const teachers = await response.json();
                console.log('Dados recebidos:', teachers);

                // Buscar informações dos usuários para cada professor
                const teachersWithUserInfo = await Promise.all(
                    teachers.map(async (teacher) => {
                        const userResponse = await fetch(`http://localhost:3001/users/${teacher.user_id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        const userData = await userResponse.json();
                        return {
                            ...teacher,
                            nome: userData.name,
                            email: userData.email,
                            telefone: userData.phone || 'Não informado'
                        };
                    })
                );
                
                setProfessores(teachersWithUserInfo);
            } catch (error) {
                console.error('Erro ao buscar professores:', error);
                setError(error.message || 'Não foi possível carregar os professores');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const filterItems = (items) => {
        if (!items) return [];
        return items.filter(item =>
            (item.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    };

    const currentItems = selectedType === 'professores' ? filterItems(professores) : filterItems(alunos);



    const handleUpdate = async (id, data) => {
        try {
            setIsLoading(true);
            const teacher = professores.find(t => t.id === id);
            
            // Atualizar o usuário
            const userResponse = await fetch(`http://localhost:3001/users/${teacher.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.nome,
                    email: data.email,
                    phone: data.telefone
                }),
            });

            if (!userResponse.ok) {
                throw new Error('Erro ao atualizar usuário');
            }

            const userData = await userResponse.json();
            const updatedTeacher = {
                ...teacher,
                nome: userData.name,
                email: userData.email,
                telefone: userData.phone || 'Não informado'
            };

            setProfessores(prev => prev.map(t => 
                t.id === id ? updatedTeacher : t
            ));
            setIsEditModalOpen(false);
            toast.success('Professor atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar professor:', error);
            toast.error('Erro ao atualizar professor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este professor?')) {
            return;
        }

        try {
            setIsLoading(true);
            const teacher = professores.find(t => t.id === id);

            // Primeiro deletar o professor
            const teacherResponse = await fetch(`http://localhost:3001/teacher/${id}`, {
                method: 'DELETE',
            });

            if (!teacherResponse.ok) {
                throw new Error('Erro ao excluir professor');
            }

            // Depois deletar o usuário
            const userResponse = await fetch(`http://localhost:3001/users/${teacher.user_id}`, {
                method: 'DELETE',
            });

            if (!userResponse.ok) {
                throw new Error('Erro ao excluir usuário');
            }

            setProfessores(prev => prev.filter(t => t.id !== id));
            toast.success('Professor excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir professor:', error);
            toast.error('Erro ao excluir professor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetails = (id) => {
        const item = professores.find(teacher => teacher.id === id);
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
                                    <TableHead>Telefone</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.nome}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.telefone}</TableCell>
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
                            {isCreateModalOpen ? 'Adicionar' : 'Editar'} {selectedType === 'professores' ? 'Professor' : 'Aluno'}
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
                            <Label htmlFor="telefone" className="text-right">
                                Telefone
                            </Label>
                            <Input
                                id="telefone"
                                value={selectedItem?.telefone || ""}
                                onChange={(e) => setSelectedItem(prev => ({ ...prev, telefone: e.target.value }))}
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
                <DialogContent className="max-w-3xl w-full">
                    <DialogHeader>
                        <DialogTitle>Detalhes</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nome Completo</Label>
                            <p className="text-sm text-muted-foreground">{selectedItem?.nome}</p>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <p className="text-sm text-muted-foreground">{selectedItem?.email}</p>
                        </div>
                        <div>
                            <Label>Telefone</Label>
                            <p className="text-sm text-muted-foreground">{selectedItem?.telefone}</p>
                        </div>
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
