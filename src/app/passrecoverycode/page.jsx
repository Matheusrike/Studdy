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
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'O código deve conter 6 digitos.')
});

const PassRecoveryCode = () => {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            code: '',
        },
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        console.log(data);
        router.push('/passrecoverynewpass');
    };

    return (
        <div className="background bg-slate-100 h-screen flex items-center justify-center">
            <div className="w-full h-full grid p-4">

                <div className="bg-white p-5 max-w-xs m-auto w-full flex flex-col justify-center items-center">
                    <Logo className="h-9 w-9" variant="icon" />
                    <p className="mt-4 text-xl font-bold tracking-tight">Recuperação de senha</p>
                    <p className="mt-4 text-l tracking-tight text-center">Insira o código de recuperação que enviamos para você em seu E-mail para redefinir sua senha.</p>

                    <Form {...form}>
                        <form className="mt-8 w-full space-y-3 justify-center items-center" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="text-center w-full justify-center items-center">
                                        <FormLabel className="w-full text-center justify-center items-center">Código de recuperação</FormLabel>
                                        <FormControl>
                                            <Controller
                                                control={form.control}
                                                name="code"
                                                render={({ field }) => (
                                                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} value={field.value[0]} onChange={(e) => field.onChange(e.target.value)} />
                                                            <InputOTPSlot index={1} value={field.value[1]} onChange={(e) => field.onChange(e.target.value)} />
                                                            <InputOTPSlot index={2} value={field.value[2]} onChange={(e) => field.onChange(e.target.value)} />
                                                        </InputOTPGroup>
                                                        <InputOTPSeparator />
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={3} value={field.value[3]} onChange={(e) => field.onChange(e.target.value)} />
                                                            <InputOTPSlot index={4} value={field.value[4]} onChange={(e) => field.onChange(e.target.value)} />
                                                            <InputOTPSlot index={5} value={field.value[5]} onChange={(e) => field.onChange(e.target.value)} />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                )}
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

                    <div className="mt-5 space-y-1">
                        <p className="mt-4 text-l tracking-tight text-center">Não recebeu o código?</p>
                        <Button className="cursor-pointer mt-4 w-full">
                            Enviar novo código
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
};

export default PassRecoveryCode;
