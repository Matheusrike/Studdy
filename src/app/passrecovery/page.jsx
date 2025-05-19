'use client';

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
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

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp"


// Validação para o e-mail
const formSchemaEmail = z.object({
	recoveryemail: z.string().email('E-mail inválido'),
});

// Validação para o código (6 dígitos)
const formSchemaCode = z.object({
	code: z.string().length(6, 'O código deve ter 6 dígitos'),
});



export default function PassRecoveryPage() {
	const [email, setEmail] = useState('');
	const [msg, setMsg] = useState('');
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);
	const [validado, setValidado] = useState(false);

	// Form para envio de e-mail
	const formEmail = useForm({
		defaultValues: {
			recoveryemail: '',
		},
		resolver: zodResolver(formSchemaEmail),
	});

	// Form para validação do código
	const formCode = useForm({
		defaultValues: {
			code: '',
		},
		resolver: zodResolver(formSchemaCode),
	});

	// Função para validar e-mail com regex simples
	const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

	// Função para enviar token por e-mail usando emailjs
	const enviarToken = (data) => {
		const emailValue = data.recoveryemail;

		if (!validarEmail(emailValue)) {
			setMsg('Informe um e-mail válido.');
			return;
		}

		setLoading(true);
		setMsg('');
		setEmail(emailValue);

		const novoToken = Math.floor(100000 + Math.random() * 900000);

		const templateParams = {
			to_email: emailValue,
			token: novoToken,
			name: 'MeuApp Support',
			from_email: 'suporte@meuapp.com',
		};

		emailjs
			.send(
				'service_qxntt75',
				'template_8wqsmdm',
				templateParams,
				'yIhgqahZ0aUqL-5De'
			)
			.then(() => {
				setMsg('Token enviado para seu e-mail!');
				setToken(novoToken);
				setValidado(true); // Avança para a tela de validação do código
				formCode.reset();
			})
			.catch(() => setMsg('Erro ao enviar e-mail.'))
			.finally(() => setLoading(false));
	};

	const reenviarToken = () => {
		if (!email) {
			setMsg('E-mail não encontrado para reenviar o código.');
			return;
		}
		setLoading(true);
		setMsg('');

		const novoToken = Math.floor(100000 + Math.random() * 900000);

		const templateParams = {
			to_email: email,
			token: novoToken,
			name: 'MeuApp Support',
			from_email: 'suporte@meuapp.com',
		};

		emailjs
			.send(
				'service_qxntt75',
				'template_8wqsmdm',
				templateParams,
				'yIhgqahZ0aUqL-5De'
			)
			.then(() => {
				setMsg('Novo token enviado para seu e-mail!');
				setToken(novoToken);
				formCode.reset();
			})
			.catch(() => setMsg('Erro ao enviar e-mail.'))
			.finally(() => setLoading(false));
	};


	// Função para validar token digitado pelo usuário
	const verificarToken = (data) => {
		const codigoDigitado = data.code;

		if (codigoDigitado === String(token)) {
			setMsg('Token validado com sucesso! Você pode trocar a senha.');
			// Aqui você pode adicionar lógica para permitir trocar a senha ou redirecionar
		} else {
			setMsg('Token inválido. Tente novamente.');
		}
	};

	return !validado ? (
		<div className="bg-slate-100 h-screen flex items-center justify-center">
			<div className="w-full max-w-xs p-4">
				<Logo className="h-9 w-9 mx-auto" variant="icon" />
				<p className="mt-4 text-xl font-bold tracking-tight text-center">
					Recuperação de senha
				</p>
				<p className="mt-2 text-center">
					Insira seu E-mail e enviaremos um código de recuperação para você
				</p>

				<Form {...formEmail}>
					<form
						className="mt-8 space-y-4"
						onSubmit={formEmail.handleSubmit(enviarToken)}
						noValidate
					>
						<FormField
							control={formEmail.control}
							name="recoveryemail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail de recuperação</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="E-mail"
											{...field}
											disabled={loading}
											className="bg-white w-full"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={loading} className="w-full">
							{loading ? 'Enviando...' : 'Enviar código de recuperação'}
						</Button>
					</form>
				</Form>

				{msg && (
					<p className="mt-4 text-center text-red-600 whitespace-pre-line">
						{msg}
					</p>
				)}

				<div className="mt-5 text-center">
					<Link href="/login" className="text-sm underline text-muted-foreground">
						Voltar para o login
					</Link>
				</div>
			</div>
		</div>
	) : (
		<div className="bg-slate-100 h-screen flex items-center justify-center">
	return (
		<div className="background h-screen flex items-center justify-center">
			<div className="w-full h-full grid  p-4">

				<div className="bg-white max-w-xs m-auto w-full flex flex-col justify-center items-center p-5">
					<Logo className="h-9 w-9" variant="icon" />
					<p className="mt-4 text-xl font-bold tracking-tight">Recuperação de senha</p>
					<p className="mt-4 text-l tracking-tight text-center">Insira o código de recuperação que enviamos para você em seu E-mail para redefinir sua senha.</p>

					<Form {...formCode}>
						<form
							className="mt-8 w-full space-y-3 justify-center items-center"
							onSubmit={formCode.handleSubmit(verificarToken)}
						>
							<FormField
								control={formCode.control}
								name="code"
								render={({ field }) => (
									<FormItem className="text-center w-full justify-center items-center">
										<FormLabel className="w-full text-center justify-center items-center">Código de recuperação</FormLabel>
										<FormControl>
											<InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="cursor-pointer mt-4 w-full">
								Redefinir senha
							</Button>
						</form>
					</Form>

					{msg && (
						<p className="mt-4 text-center text-red-600 whitespace-pre-line">
							{msg}
						</p>
					)}

					<div className="mt-5 space-y-1">
						<p className="mt-4 text-l tracking-tight text-center">Não recebeu o código?</p>
						<Button
							onClick={reenviarToken}
							disabled={loading}
							className="cursor-pointer mt-4 w-full"
						>
							{loading ? 'Enviando...' : 'Enviar novo código'}
						</Button>
					</div>
					<div className="mt-5 space-y-5">
						<Link href="login" className="cursor-pointer text-sm block underline stone-500 text-center">
							Voltar para o login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
