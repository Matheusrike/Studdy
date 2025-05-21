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

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMainDropdown } from "@/components/sidebar/nav-main"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
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

  navMain: [
    {
      title: "Início",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Simulados",
      url: "#",
      icon: Bot,
    },
    {
      title: "Estatísticas  ",
      url: "#",
      icon: BookOpen,
    },
  ],
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
  children,
  ...props
}) {
  const { state, toggleSidebar } = useSidebar();
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
          {/* Logo como trigger da sidebar */}
          <button
            onClick={toggleSidebar}
            className="focus:outline-none"
            aria-label="Alternar sidebar"
          >
            <Logo className="h-9 w-9 cursor-pointer transition-transform hover:scale-105" variant="icon" />
          </button>
          {/* Exibe o texto da logo e os botões de perfil só se expandida */}
          {state !== "collapsed" && (
            <>
              <img src="/assets/logo_text.svg" alt="logo" className="h-10 w-25" />
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-2 py-1 rounded ${role === "aluno" ? "bg-[#133D86] text-white" : "bg-gray-200"}`}
                  onClick={() => setRole("aluno")}
                >
                  Aluno
                </button>
                <button
                  className={`px-2 py-1 rounded ${role === "professor" ? "bg-[#133D86] text-white" : "bg-gray-200"}`}
                  onClick={() => setRole("professor")}
                >
                  Professor
                </button>
                <button
                  className={`px-2 py-1 rounded ${role === "admin" ? "bg-[#133D86] text-white" : "bg-gray-200"}`}
                  onClick={() => setRole("admin")}
                >
                  Admin
                </button>
              </div>
            </>
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
