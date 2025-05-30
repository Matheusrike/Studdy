'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from 'sonner';
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import { useState, useEffect } from "react";
import { Loader } from "@/components/ui/loader";

const inter = Inter({ subsets: ["latin"] });

// Define protected routes and their required roles
const protectedRoutes = {
	admin: [
		'/pages/administracao',
		'/pages/administracao/rotas',
		'/pages/cadastro',
		'/pages/concurso',
		'/pages/vestibular',
		'/pages/turmas',
	],
	professor: [
		'/pages/professor',
		'/pages/materiais',
		'/pages/simulados',
		'/pages/simulados/criar-simulados',
		'/pages/material/videoaulas/criar-videoaulas',
		'/pages/material/resumos/criar-resumos',
		'/pages/material/apostilas/criar-apostilas',
		'/pages/turmas',
	],
	aluno: [
		'/pages/aluno',
		'/pages/estudos',
		'/pages/simulados',
		'/pages/material/videoaulas',
		'/pages/material/resumos',
		'/pages/material/apostilas',
		'/pages/turmas',
	],
};

function RootLayoutContent({ children }) {
	const pathname = usePathname();
	const router = useRouter();
	const { userRole } = useUser();
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		// Simula um pequeno delay para carregar a role
		const timer = setTimeout(() => {
			// const isProtectedRoute = Object.values(protectedRoutes).some(routes =>
			//   routes.some(route => pathname.startsWith(route))
			// );

			// if (isProtectedRoute) {
			//   const allowedRoutes = protectedRoutes[userRole] || [];
			//   const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));
			//   setIsAuthorized(hasAccess);
			// } else {
			//   setIsAuthorized(true);
			// }
			setIsAuthorized(true);
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [pathname, userRole]);

	if (isLoading) {
		return <Loader />;
	}

	// if (!isAuthorized) {
	//   window.location.href = '/not-found';
	//   return null;
	// }

	return (
		<div className="flex h-screen w-screen bg-slate-100 min-h-screen min-w-screen">
			<AppSidebar />
			<main className="flex-1 overflow-y-auto">
				{children}
			</main>
		</div>
	);
}

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR">
			<head>
				<title>Studdy - Plataforma de Estudos</title>
				<meta name="description" content="Plataforma de estudos para alunos e professores" />
			</head>
			<body className={inter.className}>
				<UserProvider>
					<SidebarProvider>
						<RootLayoutContent>{children}</RootLayoutContent>
					</SidebarProvider>
				</UserProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
