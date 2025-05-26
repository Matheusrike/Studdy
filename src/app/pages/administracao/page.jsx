"use client";

import { useState } from "react";
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
import { Search, Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function TurmasPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedPessoa, setSelectedPessoa] = useState(null);
    const [selectedType, setSelectedType] = useState('todos');
    const [pessoas, setPessoas] = useState([
        {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@email.com",
            telefone: "(11) 99999-9999",
            tipo: "professor"
        },
        {
            id: 2,
            nome: "João Silva",
            email: "joao.silva@email.com",
            telefone: "(11) 99999-9999",
            tipo: "secretaria"
        },
        {
            id: 3,
            nome: "João Silva",
            matricula: "2024001",
            turma: "A",
            status: "Ativo",
            email: "joao.silva@email.com",
            telefone: "(11) 99999-9999",
            endereco: "Rua das Flores, 123",
            notas: {
                matematica: 8.5,
                portugues: 9.0,
                historia: 7.5,
                geografia: 8.0,
                ciencias: 9.5
            },
            frequencia: 95,
            observacoes: "Aluno dedicado e participativo em sala de aula.",
            tipo: "aluno"
        },
        {
            id: 4,
            nome: "Maria Santos",
            matricula: "2024002",
            turma: "A",
            status: "Ativo",
            email: "maria.santos@email.com",
            telefone: "(11) 98888-8888",
            endereco: "Av. Principal, 456",
            notas: {
                matematica: 9.5,
                portugues: 8.5,
                historia: 9.0,
                geografia: 8.5,
                ciencias: 9.0
            },
            frequencia: 98,
            observacoes: "Excelente desempenho em todas as disciplinas.",
            tipo: "aluno"
        }
    ]);

    const types = [
        { id: 'todos', label: 'Todos' },
        { id: 'professor', label: 'Professores' },
        { id: 'aluno', label: 'Alunos' },
        { id: 'secretaria', label: 'Secretária' }
    ];

    // Função genérica para filtrar qualquer tipo de item
    const filterItemsGeneric = (items, searchFields = ['nome'], typeField = null) => {
        return items.filter(item => {
            const matchesSearch = searchFields.some(field =>
                item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesType = !typeField || selectedType === 'todos' || item[typeField] === selectedType;
            return matchesSearch && matchesType;
        });
    };

    // Aplicar filtros usando a função genérica
    const filteredAlunos = filterItemsGeneric(pessoas, ['nome', 'matricula'], 'tipo');
    const filteredProfessores = filterItemsGeneric(pessoas, ['nome'], 'tipo');
    const filteredSecretaria = filterItemsGeneric(pessoas, ['nome'], 'tipo');

    // Função genérica para manipulação de edição
    const handleEdit = (item, setSelectedItem) => {
        setSelectedItem({ ...item });
        setIsEditModalOpen(true);
    };

    // Função genérica para manipulação de detalhes
    const handleDetails = (item, setSelectedItem) => {
        setSelectedItem(item);
        setIsDetailsModalOpen(true);
    };

    // Aplicar handlers específicos
    const handleEditPessoa = (pessoa) => handleEdit(pessoa, setSelectedPessoa);


    const handleSave = () => {
        if (!selectedPessoa) return;

        const requiredFields = ['nome', 'matricula', 'turma', 'status'];
        const missingFields = requiredFields.filter(field => !selectedPessoa[field]);

        if (missingFields.length > 0) {
            toast.error(`Por favor, preencha os campos: ${missingFields.join(', ')}`);
            return;
        }

        setPessoas(prevPessoas =>
            prevPessoas.map(pessoa =>
                pessoa.id === selectedPessoa.id ? selectedPessoa : pessoa
            )
        );

        setIsEditModalOpen(false);
        toast.success("Dados atualizados com sucesso!");
    };

    const handleInputChange = (field, value) => {
        setSelectedPessoa(prev => ({ ...prev, [field]: value }));
    };

    const calcularMedia = (notas) => {
        const valores = Object.values(notas);
        return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1);
    };

    const uniqueTypes = [...new Set(pessoas.map(p => p.tipo))];

    const filterItems = (items) => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'todos' || item.type === selectedType;
            return matchesSearch && matchesType;
        });
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
                                placeholder="Buscar aluno..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button>Adicionar Aluno</Button>
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterItemsGeneric(pessoas, ['nome', 'email', 'telefone'], 'tipo').map((pessoa) => (
                                <TableRow key={pessoa.id}>
                                    <TableCell>{pessoa.nome}</TableCell>
                                    <TableCell>{pessoa.email}</TableCell>
                                    <TableCell>{pessoa.telefone}</TableCell>
                                    <TableCell><span className="capitalize px-2 py-1 rounded-full text-sm bg-[#133d86] text-white">{pessoa.tipo}</span></TableCell>

                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(pessoa)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDetails(pessoa)}
                                        >
                                            <Info className="h-4 w-4 mr-2" />
                                            Detalhes
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal de Edição */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Pessoa</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nome" className="text-right">
                                Nome
                            </Label>
                            <Input
                                id="nome"
                                value={selectedPessoa?.nome || ""}
                                onChange={(e) => handleInputChange("nome", e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={selectedPessoa?.email || ""}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="telefone" className="text-right">
                                Telefone
                            </Label>
                            <Input
                                id="telefone"
                                value={selectedPessoa?.telefone || ""}
                                onChange={(e) => handleInputChange("telefone", e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Tipo
                            </Label>
                            <Select
                                value={selectedPessoa?.tipo || ""}
                                onValueChange={(value) => handleInputChange("tipo", value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professor">Professor</SelectItem>
                                    <SelectItem value="secretaria">Secretária</SelectItem>
                                    <SelectItem value="aluno">Aluno</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endereco" className="text-right">
                                Endereço
                            </Label>
                            <Input
                                id="endereco"
                                value={selectedPessoa?.endereco || ""}
                                onChange={(e) => handleInputChange("endereco", e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Detalhes */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="max-w-3xl w-full">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Pessoa</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="informacoes" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="informacoes">Informações</TabsTrigger>
                            <TabsTrigger value="notas">Notas</TabsTrigger>
                            <TabsTrigger value="observacoes">Observações</TabsTrigger>
                        </TabsList>
                        <TabsContent value="informacoes" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Nome Completo</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPessoa?.nome}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPessoa?.email}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPessoa?.email}</p>
                                </div>
                                <div>
                                    <Label>Telefone</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPessoa?.telefone}</p>
                                </div>
                                <div>
                                    <Label>Endereço</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPessoa?.endereco}</p>
                                </div>
                                <div>
                                    <Label>Frequência</Label>
                                    <div className="flex items-center gap-2">
                                        <Progress value={selectedPessoa?.frequencia} className="w-full" />
                                        <span className="text-sm text-muted-foreground">{selectedPessoa?.frequencia}%</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="notas" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {selectedPessoa?.notas && Object.entries(selectedPessoa.notas).map(([disciplina, nota]) => (
                                    <div key={disciplina}>
                                        <Label className="capitalize">{disciplina}</Label>
                                        <div className="flex items-center gap-2">
                                            <Progress value={nota * 10} className="w-full" />
                                            <span className="text-sm text-muted-foreground">{nota}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-span-2 mt-4">
                                    <Label>Média Geral</Label>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={selectedPessoa?.notas ? calcularMedia(selectedPessoa.notas) * 10 : 0}
                                            className="w-full"
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {selectedPessoa?.notas ? calcularMedia(selectedPessoa.notas) : 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="observacoes" className="space-y-4">
                            <div>
                                <Label>Observações</Label>
                                <p className="text-sm text-muted-foreground mt-2">{selectedPessoa?.observacoes}</p>
                            </div>
                        </TabsContent>
                    </Tabs>
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