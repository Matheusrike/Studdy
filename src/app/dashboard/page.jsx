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

export default function Dashboard() {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	const navigation = [
		{ name: 'Dashboard', href: '#', icon: LayoutDashboard, current: true },
		{ name: 'My Courses', href: '#', icon: GraduationCap, current: false },
		{ name: 'Exams', href: '#', icon: ClipboardList, current: false },
		{ name: 'Settings', href: '#', icon: Settings, current: false },
	];

	return (
		<div className="flex h-screen bg-muted/20">
			{/* Main Content */}
			<div className="flex flex-col flex-1 overflow-hidden">
				{/* Mobile Header */}
				<div className="md:hidden border-b bg-card px-4 py-3 flex items-center justify-between">
					<Sheet>
						<SheetTrigger asChild onClick={() => setIsMobileSidebarOpen(true)}>
							<Button variant="ghost" size="icon">
								<Menu className="h-6 w-6" />
								<span className="sr-only">Open sidebar</span>
							</Button>
						</SheetTrigger>
					</Sheet>

					<h1 className="text-lg font-bold text-primary">StudentExam Pro</h1>
					<div className="relative">
						<Bell className="h-6 w-6 text-primary cursor-pointer" />
						<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
							2
						</span>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 overflow-auto p-6">
					<div className="max-w-5xl mx-auto">
						{/* Welcome Section */}
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-4">
								<div className="relative h-12 w-12 rounded-full overflow-hidden">
									<Image
										src="/img/avatars/avatar-1.jpg"
										alt="Student Avatar"
										fill
										className="object-cover"
									/>
								</div>
								<div>
									<h1 className="text-2xl font-bold">Welcome back, Sarah!</h1>
									<p className="text-muted-foreground">Your mock exams are ready</p>
								</div>
							</div>
							<div className="relative hidden md:block">
								<Bell className="h-6 w-6 text-primary cursor-pointer" />
								<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
									2
								</span>
							</div>
						</div>

						{/* Stats Overview */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center justify-between mb-2">
										<span className="text-muted-foreground">Assigned Exams</span>
										<FileText className="h-5 w-5 text-primary" />
									</div>
									<p className="text-3xl font-bold text-primary">8</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center justify-between mb-2">
										<span className="text-muted-foreground">Completed</span>
										<CheckCircle className="h-5 w-5 text-primary" />
									</div>
									<p className="text-3xl font-bold text-primary">5</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center justify-between mb-2">
										<span className="text-muted-foreground">Average Score</span>
										<LineChart className="h-5 w-5 text-primary" />
									</div>
									<p className="text-3xl font-bold text-primary">78%</p>
								</CardContent>
							</Card>
						</div>

						{/* Upcoming Exams */}
						<div className="mb-8">
							<h2 className="text-xl font-bold mb-4">Upcoming Exams</h2>
							<div className="grid gap-4">
								<Card className="hover:border-primary transition-colors cursor-pointer">
									<CardContent className="pt-6">
										<div className="flex items-center justify-between flex-col sm:flex-row gap-4">
											<div>
												<h3 className="text-lg font-bold">Mathematics Mock Exam</h3>
												<p className="text-muted-foreground">Advanced Calculus</p>
												<div className="flex items-center gap-4 mt-2">
													<span className="flex items-center text-sm text-muted-foreground">
														<Clock className="h-4 w-4 mr-2" />
														120 minutes
													</span>
													<span className="flex items-center text-sm text-muted-foreground">
														<Calendar className="h-4 w-4 mr-2" />
														May 15, 2025
													</span>
												</div>
											</div>
											<Button className="sm:self-center">Start Exam</Button>
										</div>
									</CardContent>
								</Card>

								<Card className="hover:border-primary transition-colors cursor-pointer">
									<CardContent className="pt-6">
										<div className="flex items-center justify-between flex-col sm:flex-row gap-4">
											<div>
												<h3 className="text-lg font-bold">Physics Mock Exam</h3>
												<p className="text-muted-foreground">Quantum Mechanics</p>
												<div className="flex items-center gap-4 mt-2">
													<span className="flex items-center text-sm text-muted-foreground">
														<Clock className="h-4 w-4 mr-2" />
														90 minutes
													</span>
													<span className="flex items-center text-sm text-muted-foreground">
														<Calendar className="h-4 w-4 mr-2" />
														May 18, 2025
													</span>
												</div>
											</div>
											<Button className="sm:self-center">Start Exam</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Recent Results */}
						<div>
							<h2 className="text-xl font-bold mb-4">Recent Results</h2>
							<Card>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Exam Name</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Score</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>Chemistry Mock Test</TableCell>
												<TableCell>May 10, 2025</TableCell>
												<TableCell>85%</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className="bg-green-100 text-green-800 hover:bg-green-100"
													>
														Passed
													</Badge>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>Biology Mock Test</TableCell>
												<TableCell>May 8, 2025</TableCell>
												<TableCell>72%</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className="bg-green-100 text-green-800 hover:bg-green-100"
													>
														Passed
													</Badge>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>English Mock Test</TableCell>
												<TableCell>May 5, 2025</TableCell>
												<TableCell>68%</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
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
