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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Search, Info, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { handleApiError, handleFetchError, handleUnexpectedError } from "@/utils/errorHandler";


const SHIFT_OPTIONS = [
  { value: 'Morning', label: 'Manhã' },
  { value: 'Afternoon', label: 'Tarde' },
  { value: 'Evening', label: 'Noite' }
];


// Componentes de Formulário
const BaseFormField = ({ control, name, label, type = "text", placeholder, ...props }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} {...props} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const SelectFormField = ({ control, name, label, options, placeholder }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function TurmasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [selectedType, setSelectedType] = useState('todos');
  const [turmas, setTurmas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAtributeTeacherClassOpen, setIsAtributeTeacherClassOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    course: z.string().min(1, 'Curso é obrigatório'),
    shift: z.string().min(1, 'Turno é obrigatório'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      course: '',
      shift: '',
    },
  });

  const teachers = [
    { id: 1, name: 'João Silva' },
    { id: 2, name: 'Maria Santos' },
    { id: 3, name: 'Pedro Oliveira' },
  ];

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3001/admin/classes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        await handleApiError(response, 'buscar turmas');
        const data = await response.json();
        setTurmas(data);
      } catch (error) {
        handleFetchError(error, 'buscar turmas');
        setError('Erro ao carregar turmas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTurmas();
  }, []);

  const types = [
    { id: 'todos', label: 'Todos' },
    ...turmas.map(turma => ({
      id: turma.id,
      label: turma.name
    }))
  ];

  const filteredTurmas = turmas.filter((turma) => {
    return turma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.course.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEdit = (aluno) => {
    setSelectedAluno({ ...aluno }); // Criar uma cópia do aluno para edição
    setIsEditModalOpen(true);
  };

  const handleDetails = (turmaId) => {
    router.push(`/pages/turmas/${turmaId}`);
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      await handleApiError(response, 'criar turma');
      const responseData = await response.json();

      setTurmas([...turmas, responseData]);
      setIsCreateModalOpen(false);
      toast.success('Turma criada com sucesso!');
      form.reset();
    } catch (error) {
      handleFetchError(error, 'criar turma');
      setError('Erro ao criar turma. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  const CreateClassModal = () => {
    return (
      <>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Turma</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <BaseFormField
                  control={form.control}
                  name="name"
                  label="Nome da Turma"
                  placeholder="Nome da Turma"
                />
                <SelectFormField
                  control={form.control}
                  name="shift"
                  label="Turno"
                  options={SHIFT_OPTIONS}
                  placeholder="Selecione o turno"
                />
                <BaseFormField
                  control={form.control}
                  name="course"
                  label="Curso"
                  placeholder="Nome do Curso"
                />

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false); // Fecha o modal de criação
                      setTimeout(() => setIsAtributeTeacherClassOpen(true), 300); // Abre o próximo modal após animação
                    }}
                  >
                    {isLoading ? 'Avançando...' : 'Avançar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isAtributeTeacherClassOpen} onOpenChange={setIsAtributeTeacherClassOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Professor à Turma</DialogTitle>
              <DialogDescription>Selecione o professor que deseja atribuir à turma</DialogDescription>

            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <SelectFormField
                  control={form.control}
                  name="teacher"
                  label="Professor 1"
              options={[
                { label: "João Silva", value: "joao" },
                { label: "Maria Santos", value: "maria" },
                { label: "Carlos Lima", value: "carlos" },
              ]}
                  placeholder="Selecione o professor"
                />
                 <SelectFormField
                  control={form.control}
                  name="teacher"
                  label="Professor 2"
              options={[
                { label: "João Silva", value: "joao" },
                { label: "Maria Santos", value: "maria" },
                { label: "Carlos Lima", value: "carlos" },
              ]}
                  placeholder="Selecione o professor"
                />
                 <SelectFormField
                  control={form.control}
                  name="teacher"
                  label="Professor 3"
              options={[
                { label: "João Silva", value: "joao" },
                { label: "Maria Santos", value: "maria" },
                { label: "Carlos Lima", value: "carlos" },
              ]}
                  placeholder="Selecione o professor"
                />
                 <SelectFormField
                  control={form.control}
                  name="teacher"
                  label="Professor 4"
              options={[
                { label: "João Silva", value: "joao" },
                { label: "Maria Santos", value: "maria" },
                { label: "Carlos Lima", value: "carlos" },
              ]}
                  placeholder="Selecione o professor"
                />
                 <SelectFormField
                  control={form.control}
                  name="teacher"
                  label="Professor 5"
              options={[
                { label: "João Silva", value: "joao" },
                { label: "Maria Santos", value: "maria" },
                { label: "Carlos Lima", value: "carlos" },
              ]}
                  placeholder="Selecione o professor"
                />
              </form>
            </Form>




            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAtributeTeacherClassOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  // Finaliza o fluxo
                  setIsAtributeTeacherClassOpen(false);
                }}
              >
                {isLoading ? 'Atribuindo...' : 'Cadastrar Turma'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };


  return (
    <div className="container py-6 mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Turmas</CardTitle>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          </div>
          <div className="relative w-64 mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTurmas.map((turma) => (
                <TableRow key={turma.id}>
                  <TableCell>{turma.name}</TableCell>
                  <TableCell>{turma.course}</TableCell>
                  <TableCell>{turma.shift === 'Afternoon' ? 'Tarde' : 'Manhã'}</TableCell>
                  <TableCell>
                    {new Date(turma.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDetails(turma.id)}
                    >
                      Ver Turma
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

      {/* Modal de Criar Turma */}
      <CreateClassModal />
    </div>
  );
} 