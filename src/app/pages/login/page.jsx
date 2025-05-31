'use client';

import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleApiError, handleFetchError, handleUnexpectedError } from '@/utils/errorHandler';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUser } from "@/contexts/UserContext";
import Cookies from 'js-cookie';

const formSchema = z.object({
	email: z.string().email('E-mail inválido'),
	password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { setUserRole } = useUser();

	useEffect(() => {
		const userRole = Cookies.get('userRole');
		const userName = Cookies.get('userName');
		const userEmail = Cookies.get('userEmail');
		const userId = Cookies.get('userId');

		if (userRole && userName && userEmail && userId) {
			setUserRole(userRole);
			router.push('/pages/painel');
		}
	}, [router, setUserRole]);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data) => {
		setIsLoading(true);

		try {
			const response = await fetch('http://localhost:3000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Erro ao fazer login');
			}

			const responseData = await response.json();

			if (responseData.user) {
				// Define o tipo de usuário baseado na resposta da API
				const userRole = responseData.user.role;
				Cookies.set('userRole', userRole);
				Cookies.set('userName', responseData.user.name);
				Cookies.set('userEmail', responseData.user.email);
				Cookies.set('userId', responseData.user.id);
				setUserRole(userRole);
				toast.success('Login realizado com sucesso!');
				router.push('/pages/painel');
			} else {
				toast.error('Credenciais inválidas');
			}
		} catch (error) {
			console.error('Erro ao fazer login:', error);
			toast.error('Erro ao fazer login. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="background min-w-screen h-screen flex items-center justify-center">
			<div className="w-full h-full flex flex-row">
				<div className="w-screen lg:w-[100%] h-full flex items-center justify-center">
					<div className="bg-white w-full max-w-md p-8 space-y-6 rounded-xl">
						<Logo className="h-9 w-9 mx-auto" variant="icon" />
						<h1 className="text-2xl font-bold text-gray-900 text-center">
							Entrar no Studdy
						</h1>
						<p className="mt-2 text-center">
							Insira seu e-mail e senha para acessar o Studdy.
						</p>

						<Form {...form}>
							<form
								className="mt-8 space-y-4"
								onSubmit={form.handleSubmit(onSubmit)}
								noValidate
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>E-mail</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="seu@email.com"
													{...field}
													className="bg-white w-full"
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Senha</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="********"
													{...field}
													className="bg-white w-full"
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button 
									type="submit" 
									className="w-full hover:bg-blue-700 text-white font-medium py-2.5"
									disabled={isLoading}
								>
									{isLoading ? 'Carregando...' : 'Continuar com E-mail'}
								</Button>
							</form>
						</Form>

						<div className="mt-2 text-center">
							<Link href="/pages/recovery/passrecovery" className="text-sm underline text-muted-foreground hover:text-gray-900 transition-colors">
								Esqueceu sua senha?
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
