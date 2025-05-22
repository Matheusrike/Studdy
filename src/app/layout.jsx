'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
	const pathname = usePathname();


	const isAuthPage = pathname?.startsWith('/pages/login') ||
		pathname?.startsWith('/pages/recovery');


	if (isAuthPage) {
		return children;
	}

	return (
		<html lang="pt-BR">
			<head>
				<title>Studdy - Plataforma de Estudos</title>
				<meta name="description" content="Plataforma de estudos para alunos e professores" />
				
			</head>
			<body className={inter.className}>
				<SidebarProvider>
					<div className="flex min-h-screen min-w-screen bg-slate-100">
						<AppSidebar />
						<main className="flex-1 overflow-auto">{children}</main>
					</div>
				</SidebarProvider>
			</body>
		</html>
	);
}
