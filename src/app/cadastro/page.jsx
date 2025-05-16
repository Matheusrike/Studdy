'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    matricula: z.string().optional(),
    curso: z.string().optional(),
    formacao: z.string().optional(),
    area: z.string().optional(),
});

function CadastroForm() {
    const [tipo, setTipo] = useState("aluno");
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            email: "",
            senha: "",
            matricula: "",
            curso: "",
            formacao: "",
            area: "",
        },
    });

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('https://api-studdy.onrender.com/api/disciplinas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    mode: 'cors',
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar áreas: ${response.status}`);
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Formato de resposta inválido');
                }

                const areasList = data.map(item => item.nome || item.name || item);
                setAreas(areasList);
            } catch (error) {
                console.error('Erro ao buscar áreas:', error);
                setError(error.message || 'Não foi possível carregar as áreas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAreas();
    }, []);

    const handleTipoChange = (e) => {
        setTipo(e.target.value);
        form.reset({
            ...form.getValues(),
            matricula: "",
            curso: "",
            formacao: "",
            area: "",
        });
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);
    
            let payload;
            if (tipo === "professores") {
                payload = {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    formacao: data.formacao,
                    area_atuacao: data.area
                };
            } else {
                payload = {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    matricula: data.matricula,
                    curso: data.curso
                };
            }
    
            const response = await fetch(`https://api-studdy.onrender.com/api/${tipo}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao cadastrar (${response.status}): ${errorText}`);
            }
    
            const result = await response.json();
            console.log(`${tipo === "professores" ? "Professor" : "Aluno"} cadastrado:`, result);
    
            setSubmitSuccess(true);
            form.reset();
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setSubmitError(error.message || 'Erro ao realizar cadastro');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Cadastro</h1>

            {submitSuccess && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                    Cadastro realizado com sucesso!
                </div>
            )}

            {submitError && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {submitError}
                </div>
            )}

            <select
                name="tipo"
                id="tipo"
                value={tipo}
                onChange={handleTipoChange}
                className="mb-4 p-2 border rounded w-full max-w-md"
                disabled={isSubmitting}
            >
                <option value="">Selecione </option>
                <option value="alunos">Alunos</option>
                <option value="professores">Professores</option>
            </select>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md">
                    {tipo === "alunos" && (
                        <>
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="senha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Senha" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="matricula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Matrícula</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Matrícula" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="curso"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Curso</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Curso" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Button
                                type="submit"
                                className="mt-4"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                            </Button>
                        </>
                    )}

                    {tipo === "professores" && (
                        <>
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="senha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Senha" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="formacao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Formação</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Formação" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Área</FormLabel>
                                        <FormControl>
                                            <select
                                                className="p-2 border rounded w-full"
                                                disabled={isLoading}
                                                {...field}
                                            >
                                                <option value="">Selecione uma área</option>
                                                {areas.map((area, index) => (
                                                    <option key={`area-${index}`} value={area}>{area}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                        {isLoading && <p className="text-sm text-muted-foreground">Carregando áreas...</p>}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="mt-4"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                            </Button>
                        </>
                    )}


                </form>
            </Form>
        </div>
    );
}

export default function Cadastro() {
    return <CadastroForm />;
}