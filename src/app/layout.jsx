import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: 'Studdy - Plataforma de Estudos',
	description: 'Plataforma de estudos para alunos e professores',
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR">
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
