"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { NavMainDropdown } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import Logo from "@/components/ui/logo"

// Dados do aluno
const dataAluno = {
  user: {
    name: "aluno",
    email: "aluno@example.com",
    avatar: "/avatars/aluno.jpg",
  },
  navMainDropdown: [
    {
      title: "Material de Estudo",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Videoaulas", url: "#" },
        { title: "Apostilas", url: "#" },
        { title: "Resumos", url: "#" },
        { title: "Exercícios", url: "#" }
      ],
    }
  ],
  navMain: [
    {
      title: "Início",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Painel Principal", url: "#" },
        { title: "Meu Progresso", url: "#" },
        { title: "Perfil", url: "#" }
      ],
    },
    {
      title: "Simulados",
      url: "#",
      icon: Bot,
      items: [
        { title: "Disponíveis", url: "#" },
        { title: "Em Andamento", url: "#" },
        { title: "Concluídos", url: "#" }
      ],
    },
    {
      title: "Estatísticas  ",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Provas Anteriores", url: "#" },
        { title: "Questões Comentadas", url: "#" },
        { title: "Correções", url: "#" },
        { title: "Estatísticas", url: "#" }
      ],
    },
  ],
  projects: [
    { name: "ENEM 2024", url: "#", icon: Frame },
    { name: "Concursos", url: "#", icon: PieChart },
    { name: "Vestibulares", url: "#", icon: Map },
  ],
};

// Dados do professor
const dataProfessor = {
  user: {
    name: "professor",
    email: "prof@example.com",
    avatar: "/avatars/prof.jpg",
  },
  navMainDropdown: [
    {
      title: "Conteúdo Didático",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Minhas Aulas", url: "#" },
        { title: "Materiais", url: "#" }
      ],
    }
  ],
  navMain: [
    {
      title: "Painel",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Visão Geral", url: "#" },
        { title: "Minhas Turmas", url: "#" }
      ],
    },
    {
      title: "Atividades",
      url: "#",
      icon: Bot,
      items: [
        { title: "Criar Atividade", url: "#" },
        { title: "Corrigir Atividades", url: "#" }
      ],
    },
  ],
  projects: [
    { name: "Turma 1", url: "#", icon: Frame },
    { name: "Turma 2", url: "#", icon: PieChart },
  ],
};

// Dados do admin
const dataAdmin = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMainDropdown: [
    {
      title: "Gerenciamento",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Usuários", url: "#" },
        { title: "Permissões", url: "#" },
        { title: "Configurações", url: "#" }
      ],
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Visão Geral", url: "#" },
        { title: "Relatórios", url: "#" },
        { title: "Logs do Sistema", url: "#" }
      ],
    },
    {
      title: "Conteúdo",
      url: "#",
      icon: Bot,
      items: [
        { title: "Gerenciar Materiais", url: "#" },
        { title: "Categorias", url: "#" },
        { title: "Biblioteca", url: "#" }
      ],
    },
    {
      title: "Administração",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Backup", url: "#" },
        { title: "Manutenção", url: "#" },
        { title: "Segurança", url: "#" },
        { title: "Auditoria", url: "#" }
      ],
    },
  ],
  projects: [
    { name: "Sistema Principal", url: "#", icon: Frame },
    { name: "Ambiente de Teste", url: "#", icon: PieChart },
    { name: "Produção", url: "#", icon: Map },
  ],
};

function AlunoNav() {
  return (
    <>
      <NavMain items={dataAluno.navMain} />
      <NavMainDropdown itemsDropdown={dataAluno.navMainDropdown} />
      <NavProjects projects={dataAluno.projects} />
    </>
  );
}

function ProfessorNav() {
  return (
    <>
      <NavMain items={dataProfessor.navMain} />
      <NavMainDropdown itemsDropdown={dataProfessor.navMainDropdown} />
      <NavProjects projects={dataProfessor.projects} />
    </>
  );
}

function AdminNav() {
  return (
    <>
      <NavMain items={dataAdmin.navMain} />
      <NavMainDropdown itemsDropdown={dataAdmin.navMainDropdown} />
      <NavProjects projects={dataAdmin.projects} />
    </>
  );
}

export function AppSidebar({
  ...props
}) {
  const { state } = useSidebar();
  const [role, setRole] = React.useState("aluno");

  let NavComponent;
  let userData;

  switch (role) {
    case "admin":
      NavComponent = <AdminNav />;
      userData = dataAdmin.user;
      break;
    case "professor":
      NavComponent = <ProfessorNav />;
      userData = dataProfessor.user;
      break;
    case "aluno":
    default:
      NavComponent = <AlunoNav />;
      userData = dataAluno.user;
      break;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 mt-2">
          <Logo className="h-9 w-9 " variant="icon" />
          {state !== "collapsed" && (
            <img src="/assets/logo_text.svg" alt="logo" className="h-10 w-25" />
          )}
          {/* Botões de seleção de perfil */}
          {state !== "collapsed" && (
            <div className="flex gap-2 mt-2">
              <button
                className={`px-2 py-1 rounded ${role === "aluno" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setRole("aluno")}
              >
                Aluno
              </button>
              <button
                className={`px-2 py-1 rounded ${role === "professor" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setRole("professor")}
              >
                Professor
              </button>
              <button
                className={`px-2 py-1 rounded ${role === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setRole("admin")}
              >
                Admin
              </button>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {NavComponent}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
