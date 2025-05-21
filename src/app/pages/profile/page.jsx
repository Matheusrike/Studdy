"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Mail, 
  Edit2, 
  LogOut, 
  BookOpen,
  GraduationCap,
  Award,
  Calendar,
  Clock,
  BookMarked,
  FileText,
  Video,
  Loader2,
  Users,
  BookCheck
} from "lucide-react"

// Componente para estatísticas
const StatCard = ({ icon: Icon, label, value, suffix = "" }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}{suffix}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente para o cabeçalho do perfil
const ProfileHeader = ({ userData, role, onRoleChange, onEdit }) => (
  <Card className="mb-8">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar className="h-32 w-32">
          <AvatarImage src={userData.avatar} alt={userData.name} />
          <AvatarFallback className="text-2xl">{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={onRoleChange}
            >
              {role === "aluno" ? "Aluno" : role === "professor" ? "Professor" : "Admin"}
            </Button>
          </div>
          <p className="text-xl text-muted-foreground mb-4">{userData.occupation}</p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{userData.email}</span>
            </div>
            {role === "aluno" && (
              <>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{userData.curso}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Matrícula: {userData.matricula}</span>
                </div>
              </>
            )}
            {role === "professor" && (
              <>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>{userData.formacao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{userData.area}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4 justify-center md:justify-start">
            <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
              Editar Perfil
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente para o formulário de edição
const EditProfileForm = ({ userData, role, onSubmit, isSubmitting, onCancel }) => {
  const formSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    about: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
    ...(role === "aluno" ? {
      curso: z.string().min(2, "Curso é obrigatório"),
      matricula: z.string().min(1, "Matrícula é obrigatória"),
    } : role === "professor" ? {
      formacao: z.string().min(2, "Formação é obrigatória"),
      area: z.string().min(2, "Área é obrigatória"),
    } : {})
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      about: userData.about,
      ...(role === "aluno" ? {
        curso: userData.curso,
        matricula: userData.matricula,
      } : role === "professor" ? {
        formacao: userData.formacao,
        area: userData.area,
      } : {})
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {role === "aluno" && (
          <>
            <FormField
              control={form.control}
              name="curso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {role === "professor" && (
          <>
            <FormField
              control={form.control}
              name="formacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formação</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobre</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default function ProfilePage() {
  const [role, setRole] = React.useState("aluno");
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dados mockados
  const alunoData = {
    name: "João Silva",
    occupation: "Estudante",
    avatar: "/avatars/aluno.jpg",
    email: "aluno@example.com",
    matricula: "2024001",
    curso: "Engenharia de Software",
    about: "Estudante dedicado, focado em desenvolvimento web e mobile. Participando ativamente de projetos e simulados para aprimorar meus conhecimentos.",
    stats: {
      simuladosCompletos: 12,
      mediaAcertos: 75,
      horasEstudo: 48
    }
  };

  const professorData = {
    name: "Maria Santos",
    occupation: "Professora",
    avatar: "/avatars/prof.jpg",
    email: "prof@example.com",
    formacao: "Doutora em Educação",
    area: "Matemática",
    about: "Professora dedicada com mais de 10 anos de experiência em preparação para vestibulares e ENEM. Especialista em metodologias de ensino e desenvolvimento de materiais didáticos.",
    stats: {
      turmasAtivas: 3,
      alunosAtivos: 120,
      materiaisCriados: 45
    }
  };

  const adminData = {
    name: "Carlos Oliveira",
    occupation: "Administrador Sênior",
    avatar: "/avatars/admin.jpg", 
    email: "carlos.oliveira@studdy.com",
    about: "Especialista em gestão de plataformas educacionais com mais de 8 anos de experiência. Responsável pela supervisão geral do sistema, desenvolvimento de novas funcionalidades e garantia da qualidade do serviço.",
    stats: {
      usuariosCadastrados: 2500,
      simuladosCriados: 180,
      materiaisPublicados: 450
    }
  };

  const userData = role === "aluno" ? alunoData : role === "professor" ? professorData : adminData;

  const handleRoleChange = () => {
    setRole(role === "aluno" ? "professor" : role === "professor" ? "admin" : "aluno");
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (role === "aluno") {
        Object.assign(alunoData, data);
      } else if (role === "professor") {
        Object.assign(professorData, data);
      } else {
        Object.assign(adminData, data);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <ProfileHeader 
        userData={userData}
        role={role}
        onRoleChange={handleRoleChange}
        onEdit={() => setIsEditing(true)}
      />

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {role === "aluno" ? (
          <>
            <StatCard icon={BookOpen} label="Simulados Completos" value={userData.stats.simuladosCompletos} />
            <StatCard icon={Award} label="Média de Acertos" value={userData.stats.mediaAcertos} suffix="%" />
            <StatCard icon={Clock} label="Horas de Estudo" value={userData.stats.horasEstudo} suffix="h" />
          </>
        ) : role === "professor" ? (
          <>
            <StatCard icon={BookOpen} label="Turmas Ativas" value={userData.stats.turmasAtivas} />
            <StatCard icon={GraduationCap} label="Alunos Ativos" value={userData.stats.alunosAtivos} />
            <StatCard icon={FileText} label="Materiais Criados" value={userData.stats.materiaisCriados} />
          </>
        ) : (
          <>
            <StatCard icon={Users} label="Usuários Cadastrados" value={userData.stats.usuariosCadastrados} />
            <StatCard icon={BookCheck} label="Simulados Criados" value={userData.stats.simuladosCriados} />
            <StatCard icon={FileText} label="Materiais Publicados" value={userData.stats.materiaisPublicados} />
          </>
        )}
      </div>

      {/* Abas de Conteúdo */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="about">Sobre</TabsTrigger>
          <TabsTrigger value="materials">
            {role === "aluno" ? "Materiais" : role === "professor" ? "Turmas" : "Dashboard"}
          </TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sobre Mim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{userData.about}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          {role === "aluno" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard icon={Video} label="Videoaulas" value="8" />
              <StatCard icon={FileText} label="Apostilas" value="5" />
              <StatCard icon={BookMarked} label="Resumos" value="12" />
            </div>
          ) : role === "professor" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Turma ENEM 2024</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Alunos</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="default">Ativa</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Turma Vestibular</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Alunos</span>
                      <span className="font-medium">35</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="default">Ativa</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard icon={Users} label="Novos Usuários" value="25" suffix=" hoje" />
              <StatCard icon={BookCheck} label="Simulados Ativos" value="12" />
              <StatCard icon={FileText} label="Materiais Pendentes" value="8" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {role === "aluno" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ENEM 2024</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Último Acesso</span>
                      <span className="font-medium">15/03/2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="default">Em andamento</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vestibular UNESP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Último Acesso</span>
                      <span className="font-medium">10/03/2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="default">Em andamento</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : role === "professor" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Aulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma aula agendada para os próximos dias.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard icon={Users} label="Usuários Ativos" value="850" />
              <StatCard icon={BookCheck} label="Simulados em Andamento" value="8" />
              <StatCard icon={FileText} label="Materiais Revisados" value="45" />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <EditProfileForm
            userData={userData}
            role={role}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 