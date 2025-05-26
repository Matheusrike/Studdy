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
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [selectedType, setSelectedType] = useState('todos');
  const [alunos, setAlunos] = useState([
    {
      id: 1,
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
      observacoes: "Aluno dedicado e participativo em sala de aula."
    },
    {
      id: 2,
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
      observacoes: "Excelente desempenho em todas as disciplinas."
    },
  ]);

  const types = [
    { id: 'todos', label: 'Todos' },
    { id: 'A', label: 'Turma A' },
    { id: 'B', label: 'Turma B' },
    { id: 'C', label: 'Turma C' }
  ];

  const filteredAlunos = alunos.filter((aluno) => {
    const matchesSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || aluno.turma === selectedType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (aluno) => {
    setSelectedAluno({ ...aluno }); // Criar uma cópia do aluno para edição
    setIsEditModalOpen(true);
  };

  const handleDetails = (aluno) => {
    setSelectedAluno(aluno);
    setIsDetailsModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedAluno) return;

    // Validar campos obrigatórios
    if (!selectedAluno.nome || !selectedAluno.matricula || !selectedAluno.turma || !selectedAluno.status) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Atualizar o aluno na lista
    setAlunos(alunos.map(aluno =>
      aluno.id === selectedAluno.id ? selectedAluno : aluno
    ));

    // Fechar o modal e mostrar mensagem de sucesso
    setIsEditModalOpen(false);
    toast.success("Dados do aluno atualizados com sucesso!");
  };

  const handleInputChange = (field, value) => {
    setSelectedAluno(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularMedia = (notas) => {
    const valores = Object.values(notas);
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1);
  };

  const uniqueTypes = [...new Set(alunos.map(a => a.turma))];

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
          <CardTitle className="text-2xl font-bold">Turmas</CardTitle>
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
                <TableHead>Matrícula</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.nome}</TableCell>
                  <TableCell>{aluno.matricula}</TableCell>
                  <TableCell>{aluno.turma}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${aluno.status === "Ativo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {aluno.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(aluno)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDetails(aluno)}
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
            <DialogTitle>Editar Aluno</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={selectedAluno?.nome || ""}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="matricula" className="text-right">
                Matrícula
              </Label>
              <Input
                id="matricula"
                value={selectedAluno?.matricula || ""}
                onChange={(e) => handleInputChange("matricula", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="turma" className="text-right">
                Turma
              </Label>
              <Select
                value={selectedAluno?.turma || ""}
                onValueChange={(value) => handleInputChange("turma", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Turma A</SelectItem>
                  <SelectItem value="B">Turma B</SelectItem>
                  <SelectItem value="C">Turma C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={selectedAluno?.status || ""}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={selectedAluno?.email || ""}
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
                value={selectedAluno?.telefone || ""}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco" className="text-right">
                Endereço
              </Label>
              <Input
                id="endereco"
                value={selectedAluno?.endereco || ""}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno</DialogTitle>
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
                  <p className="text-sm text-muted-foreground">{selectedAluno?.nome}</p>
                </div>
                <div>
                  <Label>Matrícula</Label>
                  <p className="text-sm text-muted-foreground">{selectedAluno?.matricula}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedAluno?.email}</p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedAluno?.telefone}</p>
                </div>
                <div>
                  <Label>Endereço</Label>
                  <p className="text-sm text-muted-foreground">{selectedAluno?.endereco}</p>
                </div>
                <div>
                  <Label>Frequência</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedAluno?.frequencia} className="w-full" />
                    <span className="text-sm text-muted-foreground">{selectedAluno?.frequencia}%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notas" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {selectedAluno?.notas && Object.entries(selectedAluno.notas).map(([disciplina, nota]) => (
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
                      value={selectedAluno?.notas ? calcularMedia(selectedAluno.notas) * 10 : 0}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedAluno?.notas ? calcularMedia(selectedAluno.notas) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="observacoes" className="space-y-4">
              <div>
                <Label>Observações</Label>
                <p className="text-sm text-muted-foreground mt-2">{selectedAluno?.observacoes}</p>
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