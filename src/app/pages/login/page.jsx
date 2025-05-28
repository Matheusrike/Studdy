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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleApiError, handleFetchError, handleUnexpectedError } from '@/utils/errorHandler';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().email('E-mail inválido'),
	password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data) => {
		setIsLoading(true);
		setError(null);
		setSubmitError(null);

		try {
			const response = await fetch('http://localhost:3001/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			await handleApiError(response, 'fazer login');
			const responseData = await response.json();

			if (responseData.token) {
				localStorage.setItem('token', responseData.token);
				setSubmitSuccess(true);
				router.push('/pages/dashboard');
			} else {
				setSubmitError('Credenciais inválidas');
			}
		} catch (error) {
			handleFetchError(error, 'fazer login');
			setSubmitError('Erro ao fazer login. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="background min-w-screen h-screen flex items-center justify-center">
			<div className="w-full h-full flex flex-row">

				{/* Hidden on mobile, shown on large screens */}
				{/* <div className="hidden w-[60%] lg:flex rounded-lg items-center justify-center">
					<img
						className="w-full h-full object-cover"
						src="https://media.istockphoto.com/id/1481866065/pt/foto/smartphone-with-blank-white-screen-laying-at-the-laptop-app-screen-mockup.jpg?s=612x612&w=0&k=20&c=bxOlEpEfPsobj_DjxRnnMd49EoSiDRO_5r3gq4IJ0vY="
						alt="illustration"
					/>
				</div> */}

				<div className=" w-screen lg:w-[100%] h-full  flex items-center justify-center">
					<div className="bg-white w-full max-w-md p-8 space-y-6 rounded-xl ">
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
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full  hover:bg-blue-700 text-white font-medium py-2.5">
									Continuar com E-mail
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
};

