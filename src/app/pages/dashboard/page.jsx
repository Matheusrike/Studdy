	'use client';

	import { useState } from 'react';
	import {
		Bell,
		Clock,
		Calendar,
		FileText,
		CheckCircle,
		LineChart,
		LayoutDashboard,
		GraduationCap,
		ClipboardList,
		Settings,
		LogOut,
		Menu,
	} from 'lucide-react';
	import Image from 'next/image';
	import Link from 'next/link';
	import { Card, CardContent } from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Badge } from '@/components/ui/badge';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '@/components/ui/table';
	import { cn } from '@/lib/utils';
	import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
	import { Separator } from '@/components/ui/separator';
	import Logo from '@/components/ui/logo';

	const plataformas = [
		{
			nome: "Alura",
			img: "/assets/alura.png",
			link: "https://www.alura.com.br/"
		},
		{
			nome: "SPeak",
			img: "/assets/speak.png",
			link: "https://www.speak.com.br/",
		},
		{
			nome: "Educação Profissional",
			img: "/assets/educacaoprofissional.png",
			link: "https://www.educacaoprofissional.com.br/",
		},
		{
			nome: "Prepara SP",
			img: "/assets/prepara-sp.png",
			link: "https://www.prepara.sp.gov.br/",
		},
		{
			nome: "Khan Academy",
			img: "/assets/khan.png",
			link: "https://www.khanacademy.org/",
		},		
		{
			nome: "Projeto de Empreendedorismo",
			img: "/assets/empre.jfif",
			link: "https://www.empreendedorismo.sp.gov.br/",
		},
		{
			nome: "São Paulo em Ação",
			img: "/assets/spsp.jpeg",
			link: "https://www.sao-paulo-em-acao.sp.gov.br/",
		},
		{
			nome: "LeiaSP",
			img: "/assets/leia-sp.png",
			link: "https://www.leia.sp.gov.br/",
		},
	];

	function PlataformasAprendizagem() {
		return (
			<div className="mb-8">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Plataformas de Aprendizagem</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{plataformas.map((plataforma) => (
						<a href={plataforma.link} target="_blank" rel="noopener noreferrer">
							<Card
								key={plataforma.nome}
								className="flex flex-col items-center justify-center p-3 hover:shadow-lg transition-all cursor-pointer h-35"
							>
								<Image
									src={plataforma.img}
									alt={plataforma.nome}
									width={50}
									height={50}
							
								/>
								<span className="text-lg font-medium">{plataforma.nome}</span>
							</Card>
						</a>
					))}
				</div>
			</div>
		);
	}

	export default function Dashboard() {
		return (
			<div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
				{/* Main Content */}
				<div className="flex flex-col flex-1 overflow-hidden">
					{/* Main Content Area */}
					<div className="flex-1 overflow-auto p-6">
						<div className="max-w-7xl mx-auto">
							{/* Welcome Section */}
							<div className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/50">
								<div className="flex items-center gap-6">
									<div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-lg">
										<Image
											src="/img/avatars/avatar-1.jpg"
											alt="Student Avatar"
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Welcome back, Sarah!</h1>
										<p className="text-muted-foreground text-lg">Your mock exams are ready</p>
									</div>
								</div>
								<div className="relative hidden md:block">
									<Button variant="ghost" size="icon" className="relative">
										<Bell className="h-6 w-6 text-primary" />
										<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
											2
										</span>
									</Button>
								</div>
							</div>

							{/* Stats Overview */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
								<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<CardContent className="pt-6">
										<div className="flex items-center justify-between mb-4">
											<span className="text-muted-foreground text-lg">Assigned Exams</span>
											<div className="p-2 bg-primary/10 rounded-lg">
												<FileText className="h-6 w-6 text-primary" />
											</div>
										</div>
										<p className="text-4xl font-bold text-primary">8</p>
										<p className="text-sm text-muted-foreground mt-2">+2 from last week</p>
									</CardContent>
								</Card>

								<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<CardContent className="pt-6">
										<div className="flex items-center justify-between mb-4">
											<span className="text-muted-foreground text-lg">Completed</span>
											<div className="p-2 bg-green-100 rounded-lg">
												<CheckCircle className="h-6 w-6 text-green-600" />
											</div>
										</div>
										<p className="text-4xl font-bold text-green-600">5</p>
										<p className="text-sm text-muted-foreground mt-2">62.5% completion rate</p>
									</CardContent>
								</Card>

								<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<CardContent className="pt-6">
										<div className="flex items-center justify-between mb-4">
											<span className="text-muted-foreground text-lg">Average Score</span>
											<div className="p-2 bg-blue-100 rounded-lg">
												<LineChart className="h-6 w-6 text-blue-600" />
											</div>
										</div>
										<p className="text-4xl font-bold text-blue-600">78%</p>
										<p className="text-sm text-muted-foreground mt-2">+5% from last month</p>
									</CardContent>
								</Card>
							</div>

							{/* Plataformas de Aprendizagem */}
							<PlataformasAprendizagem />

							{/* Recent Results */}
							<div>
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-bold">Recent Results</h2>
									<Button variant="outline" className="gap-2">
										View All Results
									</Button>
								</div>
								<Card className="overflow-hidden">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow className="bg-slate-50">
													<TableHead className="font-semibold">Exam Name</TableHead>
													<TableHead className="font-semibold">Date</TableHead>
													<TableHead className="font-semibold">Score</TableHead>
													<TableHead className="font-semibold">Status</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												<TableRow className="hover:bg-slate-50/50">
													<TableCell className="font-medium">Chemistry Mock Test</TableCell>
													<TableCell>May 10, 2025</TableCell>
													<TableCell className="font-semibold text-green-600">85%</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1"
														>
															Passed
														</Badge>
													</TableCell>
												</TableRow>
												<TableRow className="hover:bg-slate-50/50">
													<TableCell className="font-medium">Biology Mock Test</TableCell>
													<TableCell>May 8, 2025</TableCell>
													<TableCell className="font-semibold text-green-600">72%</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1"
														>
															Passed
														</Badge>
													</TableCell>
												</TableRow>
												<TableRow className="hover:bg-slate-50/50">
													<TableCell className="font-medium">English Mock Test</TableCell>
													<TableCell>May 5, 2025</TableCell>
													<TableCell className="font-semibold text-yellow-600">68%</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1"
														>
															Review
														</Badge>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
