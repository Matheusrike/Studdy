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
import { useRouter } from 'next/navigation';


const formSchema = z.object({
	recoveryemail: z.string().email('E-mail inválido')
});

const PassRecoveryPage = () => {

	const router = useRouter();

	const form = useForm({
		defaultValues: {
			recoveryemail: ''
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = (data) => {
		console.log(data);
		router.push('/passrecoverycode');
	};

	return (
		<div className="bg-slate-100 h-screen flex items-center justify-center">
			<div className="w-full h-full grid  p-4">

				<div className="max-w-xs m-auto w-full flex flex-col justify-center items-center">
					<Logo className="h-9 w-9" variant="icon" />
					<p className="mt-4 text-xl font-bold tracking-tight">Recuperação de senha</p>
					<p className="mt-4 text-l tracking-tight text-center">Insira seu E-mail e enviaremos um código de recuperação para você</p>

					<Form {...form}>
						<form className="mt-8 w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="recoveryemail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail de recuperação</FormLabel>
										<FormControl>
											<Input type="email" placeholder="E-mail" className="bg-white w-full" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="cursor-pointer mt-4 w-full">
								Enviar código de recuperação
							</Button>
						</form>
					</Form>

					<div className="mt-5 space-y-5">
						<Link href="login" className="cursor-pointer text-sm block underline text-muted-foreground text-center">
							Voltar para o login
						</Link>
					</div>
				</div>

			</div>
		</div>

	);
};


export default PassRecoveryPage;
