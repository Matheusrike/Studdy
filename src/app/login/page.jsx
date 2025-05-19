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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().email('E-mail inválido'),
	password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});


export default function LoginPage() {
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = (data) => {
		console.log(data);
	};

	return (
		<div className="background bg-slate-100 h-screen flex items-center justify-center">
			<div className=" w-full h-full grid lg:grid-cols-[3fr_600px] ">

				<div className=" hidden lg:flex rounded-lg items-center justify-center">
					<img
						className=" w-full h-full object-cover"
						src="/assets/students.webp"
						alt="illustration"
					/>
				</div>

				<div className="bg-white p-5 max-w-xs m-auto w-full flex flex-col items-center">
					<Logo className="h-9 w-9" variant="icon" />
					<p className="mt-4 text-xl font-bold tracking-tight">Entrar no Studdy</p>

					<Form {...form}>
						<form className="mt-8 w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input type="email" placeholder="E-mail" className="bg-white w-full" {...field} />
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
											<Input type="password" placeholder="Senha" className="bg-white w-full" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="cursor-pointer mt-4 w-full">
								Continuar com E-mail
							</Button>
						</form>
					</Form>

					<div className="mt-5 space-y-5">
						<Link href="passrecovery" className="cursor-pointer text-sm block underline stone-500 text-center">
							Esqueceu sua senha?
						</Link>
					</div>
				</div>

			</div>
		</div>

	);
};

