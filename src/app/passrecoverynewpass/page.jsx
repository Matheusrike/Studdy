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

const formSchema = z
    .object({
        newpassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
        confirmnewpassword: z.string().min(6, 'A confirmação deve ter pelo menos 6 caracteres'),
    })
    .refine((data) => data.newpassword === data.confirmnewpassword, {
        message: 'As senhas não coincidem',
        path: ['confirmnewpassword'],
    });

const PassRecoveryNewPass = () => {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            newpassword: '',
            confirmnewpassword: '',
        },
        resolver: zodResolver(formSchema),
    });

    const newPassword = form.watch('newpassword');

    const passwordRequirements = [
        {
            label: 'Pelo menos 6 caracteres',
            isValid: newPassword.length >= 6,
        },
        {
            label: 'Pelo menos uma letra maiúscula',
            isValid: /[A-Z]/.test(newPassword),
        },
        {
            label: 'Pelo menos um número',
            isValid: /\d/.test(newPassword),
        },
    ];

    const onSubmit = (data) => {
        console.log(data);
        router.push('/login');
    };

    return (
        <div className="background bg-slate-100 h-screen flex items-center justify-center">
            <div className="w-full h-full grid p-4">
                <div className="bg-white  p-5 max-w-xs m-auto w-full flex flex-col justify-center items-center">
                    <Logo className="h-9 w-9" variant="icon" />
                    <p className="mt-4 text-xl font-bold tracking-tight">Recuperação de senha</p>
                    <p className="mt-4 text-l tracking-tight text-center">Insira a senha nova:</p>

                    <Form {...form}>
                        <form className="mt-8 w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="newpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha Nova</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Nova Senha"
                                                className="bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />

                                        {/* Requisitos da senha com ícones */}
                                        <ul className="mt-2 text-sm space-y-1">
                                            {passwordRequirements.map((req, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <span className={req.isValid ? 'text-green-600' : 'text-red-600'}>
                                                        {req.isValid ? '✅' : '❌'}
                                                    </span>
                                                    {req.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmnewpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Nova Senha"
                                                className="bg-white w-full"
                                                {...field}
                                            />
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

                    <div className="mt-5 space-y-5">
                        <Link href="login" className="cursor-pointer text-sm block underline text-center stone-500">
                            Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassRecoveryNewPass;
