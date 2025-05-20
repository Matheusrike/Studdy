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
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMainDropdown: [
    {
      title: "Material de Estudo",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        {
          title: "Videoaulas",
          url: "#",
        },
        {
          title: "Apostilas",
          url: "#",
        },
        {
          title: "Resumos",
          url: "#",
        },
        {
          title: "Exercícios",
          url: "#",
        }
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
        {
          title: "Painel Principal",
          url: "#",
        },
        {
          title: "Meu Progresso",
          url: "#",
        },
        {
          title: "Perfil",
          url: "#",
        }
      ],
    },
    {
      title: "Simulados",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Disponíveis",
          url: "#",
        },
        {
          title: "Em Andamento",
          url: "#",
        },
        {
          title: "Concluídos",
          url: "#",
        }
      ],
    },
    {
      title: "Estatísticas  ",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Provas Anteriores",
          url: "#",
        },
        {
          title: "Questões Comentadas",
          url: "#",
        },
        {
          title: "Correções",
          url: "#",
        },
        {
          title: "Estatísticas",
          url: "#",
        }
      ],
    },



  ],
  projects: [
    {
      name: "ENEM 2024",
      url: "#",
      icon: Frame,
    },
    {
      name: "Concursos",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Vestibulares",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-3 mt-2">
          <Logo className="h-9 w-9 " variant="icon" />
          {state !== "collapsed" && (
            <img src="/assets/logo_text.svg" alt="logo" className="h-10 w-25" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMainDropdown itemsDropdown={data.navMainDropdown} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
