"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMainDropdown } from "@/components/sidebar/nav-main"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "@/components/ui/logo"
import Cookies from "js-cookie"

// Dados do aluno
const dataAluno = {
  user: {
    name: "aluno",
    email: "aluno@example.com",
    avatar: "/avatars/aluno.jpg",
  },
  navMain: [
    { title: "Painel", url: "/pages/painel", icon: SquareTerminal, isActive: true },
    { title: "Simulados", url: "/pages/simulados", icon: Bot },
    { title: "Estatísticas", url: "/pages/estatisticas", icon: BookOpen },
  ],
  navMainDropdown: [
    {
      title: "Biblioteca",
      url: "/pages/material",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Materiais", url: "/pages/material" },
        { title: "Videoaulas", url: "/pages/material/videoaulas" },
        { title: "Apostilas", url: "/pages/material/apostilas" },
        { title: "Resumos", url: "/pages/material/resumos" },
      ],
    },
  ],
  projects: [
    { name: "Concursos", url: "/pages/concursos", icon: PieChart },
    { name: "Vestibulares", url: "/pages/vestibulares", icon: Map },
  ],
}

// Dados do professor
const dataProfessor = {
  user: {
    name: "professor",
    email: "prof@example.com",
    avatar: "/avatars/prof.jpg",
  },
  navMain: [
    { title: "Painel", url: "/pages/painel", icon: SquareTerminal, isActive: true },
    { title: "Atividades", url: "#", icon: Bot },
  ],
  navMainDropdown: [
    {
      title: "Conteúdo Didático",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Minhas Aulas", url: "#" },
        { title: "Materiais", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Turma 1", url: "#", icon: Frame },
    { name: "Turma 2", url: "#", icon: PieChart },
  ],
}

// Dados do admin
const dataAdmin = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    { title: "Painel", url: "/pages/painel", icon: SquareTerminal, isActive: true },
    { title: "Administração", url: "/pages/administracao", icon: BookOpen },
  ],
  navMainDropdown: [
    {
      title: "Gerenciamento",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Usuários", url: "#" },
        { title: "Permissões", url: "#" },
        { title: "Configurações", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Sistema Principal", url: "#", icon: Frame },
    { name: "Ambiente de Teste", url: "#", icon: PieChart },
    { name: "Produção", url: "#", icon: Map },
  ],
}

// Componentes de navegação
function AlunoNav() {
  return (
    <>
      <NavMain items={dataAluno.navMain} />
      <NavMainDropdown itemsDropdown={dataAluno.navMainDropdown} />
      <NavProjects projects={dataAluno.projects} />
    </>
  )
}

function ProfessorNav() {
  return (
    <>
      <NavMain items={dataProfessor.navMain} />
      <NavMainDropdown itemsDropdown={dataProfessor.navMainDropdown} />
      <NavProjects projects={dataProfessor.projects} />
    </>
  )
}

function AdminNav() {
  return (
    <>
      <NavMain items={dataAdmin.navMain} />
      <NavMainDropdown itemsDropdown={dataAdmin.navMainDropdown} />
      <NavProjects projects={dataAdmin.projects} />
    </>
  )
}
export function AppSidebar({ children, ...props }) {
  const { state, toggleSidebar } = useSidebar()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const role = Cookies.get("userRole")
    console.log("🚀 Papel detectado via cookie:", role) // <== debug
    setUserRole(role || "Student")
  }, [])

  if (!userRole) return null // ou um loader visual

  const { user, NavComponent } = (() => {
    switch (userRole) {
      case "Admin":
        return { user: dataAdmin.user, NavComponent: <AdminNav /> }
      case "Teacher":
        return { user: dataProfessor.user, NavComponent: <ProfessorNav /> }
      case "Student":
      default:
        return { user: dataAluno.user, NavComponent: <AlunoNav /> }
    }
  })()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 mt-2">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none"
            aria-label="Alternar sidebar"
          >
            <Logo className="h-9 w-9 cursor-pointer transition-transform hover:scale-105" variant="icon" />
          </button>
          {state !== "collapsed" && (
            <img src="/assets/logo_text.svg" alt="logo" className="h-10 w-25" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>{NavComponent}</SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
