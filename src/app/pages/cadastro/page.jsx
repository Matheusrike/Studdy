'use client';

import { useState, useEffect } from "react";
import {
    Form,
    FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Logo from '@/components/ui/logo';
import { BaseFormField, SelectFormField } from "@/components/ui/formfield";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/loader";

const ENDPOINTS = {
    alunos: "http://localhost:3001/admin/students",
    professores: "http://localhost:3001/admin/teachers",
    turmas: "http://localhost:3001/admin/classes",
    disciplinas: "http://localhost:3001/subject"
};

const shiftTurma = (shift) => {
    const shiftOption = SHIFT_OPTIONS.find(option => option.value === shift);
    return shiftOption ? shiftOption.label : shift;
};

const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : null;

const formSchema = z.object({
    tipo: z.string().min(1, "Selecione um tipo de usuário"),
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z.string().email("Email inválido").optional().or(z.literal('')),
    password: z.string()
        .min(6, "Senha deve ter pelo menos 6 caracteres")
        .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
        .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
        .regex(/[0-9]/, "Senha deve conter pelo menos um número")
        .optional()
        .or(z.literal('')),
    cpf: z.string()
        .min(11, "CPF deve ter 11 dígitos")
        .max(14, "CPF deve ter no máximo 14 dígitos")
        .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido")
        .optional()
        .or(z.literal('')),
    birth_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
        .optional()
        .or(z.literal('')),
    class: z.string().min(1, "Selecione uma turma").optional().or(z.literal('')),
    curso: z.string().max(100, "Curso deve ter no máximo 100 caracteres").optional().or(z.literal('')),
    area: z.string().optional().or(z.literal('')),
    descricao: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional().or(z.literal('')),
    horario: z.string().optional().or(z.literal('')),
    data: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
        .optional()
        .or(z.literal(''))



}).refine((data) => {
    // Validações específicas por tipo
    if (data.tipo === 'professores' || data.tipo === 'alunos') {
        return data.email && data.password && data.cpf && data.birth_date;
    }

    if (data.tipo === 'concursos' || data.tipo === 'vestibulares') {
        return data.data && data.tipo_concurso;
    }
    return true;
}, {
    message: "Preencha todos os campos obrigatórios",
    path: ["tipo"]
});

// Formulários específicos
const DisciplinaForm = ({ control }) => (
    <BaseFormField
        control={control}
        name="name"
        label="Nome da Disciplina"
        placeholder="Nome da Disciplina"
    />
);

const ProfessorForm = ({ control, areas, isLoading, error }) => (
    <>
        <BaseFormField
            control={control}
            name="name"
            label="Nome"
            placeholder="Nome"
        />
        <BaseFormField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
        />
        <BaseFormField
            control={control}
            name="password"
            label="Senha"
            type="password"
            placeholder="Senha"
        />
        <BaseFormField
            control={control}
            name="cpf"
            label="CPF"
            placeholder="CPF"
        />
        <BaseFormField
            control={control}
            name="birth_date"
            label="Data de Nascimento"
            type="date"
            placeholder="Data de Nascimento"
        />
        <SelectFormField
            control={control}
            name="area"
            label="Disciplina 1"
            options={areas.map((area, index) => ({
                value: (index + 1).toString(),
                label: area.charAt(0).toUpperCase() + area.slice(1)
            }))}
            placeholder="Selecione uma disciplina"
            disabled={isLoading}
        />
        <SelectFormField
            control={control}
            name="area2"
            label="Disciplina 2"
            options={areas.map((area, index) => ({
                value: (index + 1).toString(),
                label: area.charAt(0).toUpperCase() + area.slice(1)
            }))
            }
            placeholder="Selecione uma disciplina"
            disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isLoading && <p className="text-sm text-muted-foreground">Carregando disciplinas...</p>}
    </>
);

const AlunoForm = ({ control, turmas, isLoading, error }) => (
    <>
        <BaseFormField
            control={control}
            name="name"
            label="Nome"
            placeholder="Nome"
        />
        <BaseFormField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
        />
        <BaseFormField
            control={control}
            name="password"
            label="Senha"
            type="password"
            placeholder="Senha"
        />
        <BaseFormField
            control={control}
            name="cpf"
            label="CPF"
            placeholder="CPF"
        />
        <BaseFormField
            control={control}
            name="birth_date"
            label="Data de Nascimento"
            type="date"
            placeholder="Data de Nascimento"
        />

        <div className="space-y-2">
            <FormLabel>Turma</FormLabel>
            {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Carregando turmas...</span>
                </div>
            ) : error ? (
                <div className="text-sm text-red-500">
                    {error}
                </div>
            ) : turmas.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                    Nenhuma turma disponível
                </div>
            ) : (
                <SelectFormField
                    control={control}
                    name="class"
                    label=""
                    options={turmas.map(turma => ({
                        value: turma.id.toString(),
                        label: `${turma.name} - ${shiftTurma(turma.shift)} (${turma.course})`
                    }))}
                    placeholder="Selecione uma turma"
                />
            )}
        </div>
    </>
);



function CadastroForm() {
    const { userRole } = useUser();
    const router = useRouter();
    const [state, setState] = useState({
        areas: [],
        turmas: [],
        isLoading: false,
        isLoadingTurmas: false,
        error: null,
        errorTurmas: null,
        isSubmitting: false,
        submitError: null,
        submitSuccess: false
    });
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipo: "selecione",
            name: "",
            email: "",
            password: "",
            cpf: "",
            birth_date: "",
            formacao: "",
            area: "",
            descricao: "",
            horario: "",
            data: "",
            icone: "",
            color: "#133D86",
            class: "",
            category: "",
        },
    });

    const tipo = form.watch("tipo");

    const fetchData = async (endpoint, setter, loadingKey) => {
        try {
            setState(prev => ({ ...prev, [loadingKey]: true }));
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error(`Erro ao buscar dados de ${endpoint}`);

            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error(`Erro ao buscar dados:`, error);
            setState(prev => ({
                ...prev,
                error: error.message,
                [loadingKey]: false
            }));
        } finally {
            setState(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    // Carregar dados iniciais apenas uma vez
    useEffect(() => {
        const loadInitialData = async () => {
            await fetchData(
                ENDPOINTS.turmas,
                data => setState(prev => ({ ...prev, turmas: data })),
                'isLoadingTurmas'
            );
            await fetchData(
                ENDPOINTS.disciplinas,
                data => setState(prev => ({ ...prev, areas: data.map(item => item.name) })),
                'isLoading'
            );
        };

        loadInitialData();
    }, []);

    // Recarregar turmas apenas quando o tipo mudar para alunos
    useEffect(() => {
        if (tipo === 'alunos' && state.turmas.length === 0) {
            fetchData(
                ENDPOINTS.turmas,
                data => setState(prev => ({ ...prev, turmas: data })),
                'isLoadingTurmas'
            );
        }
    }, [tipo]);

    useEffect(() => {
        // Simulate loading user role
        const timer = setTimeout(() => {
            if (userRole !== "admin") {
                router.push("/not-found");
            } else {
                setIsAuthorized(true);
            }
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [userRole, router]);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isAuthorized) {
        return null;
    }

    const formatPayload = (data, tipo) => {
        const payloads = {
            disciplinas: { name: data.name.trim() },
            professores: {
                user: {
                    name: data.name.trim(),
                    email: data.email.trim().toLowerCase(),
                    password: data.password,
                    cpf: data.cpf.replace(/\D/g, ''),
                    birth_date: formatDate(data.birth_date),
                    role: "Teacher"
                },
                teacher: {
                    subjects: [parseInt(data.area || '1'), parseInt(data.area2 || '')].filter(id => !isNaN(id))
                }
            },
            alunos: {
                user: {
                    name: data.name.trim(),
                    email: data.email.trim().toLowerCase(),
                    password: data.password,
                    cpf: data.cpf.replace(/\D/g, ''),
                    birth_date: formatDate(data.birth_date),
                    role: "Student"
                },
                student: {
                    class_id: data.class ? parseInt(data.class) : null
                }
            }
        };
        return payloads[tipo];
    };

    const onSubmit = async (data) => {
        try {
            setState(prev => ({ ...prev, isSubmitting: true, submitError: null, submitSuccess: false }));

            const endpoint = ENDPOINTS[data.tipo];
            if (!endpoint) throw new Error("Tipo de cadastro inválido");

            const cleanData = formatPayload(data, data.tipo);
            if (!cleanData) throw new Error("Formato de dados inválido para o tipo selecionado");

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(cleanData)
            });

            const responseText = await response.text();
            const responseData = responseText ? JSON.parse(responseText) : {};

            if (!response.ok) {
                throw new Error(responseData.message || `Erro ao cadastrar: ${response.status}`);
            }

            setState(prev => ({ ...prev, submitSuccess: true }));
            form.reset();
        } catch (error) {
            console.error("Erro no cadastro:", error);
            setState(prev => ({ ...prev, submitError: error.message }));
        } finally {
            setState(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    const renderFormByType = () => {
        switch (tipo) {
            case "disciplinas":
                return <DisciplinaForm control={form.control} />;
            case "professores":
                return <ProfessorForm
                    control={form.control}
                    areas={state.areas}
                    turmas={state.turmas}
                    isLoading={state.isLoading}
                    error={state.error}
                />;
            case "alunos":
                return <AlunoForm
                    control={form.control}
                    turmas={state.turmas}
                    isLoading={state.isLoadingTurmas}
                    error={state.errorTurmas}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center mb-6">
                    <Logo className="h-9 w-9" variant="icon" />
                    <h1 className="mt-4 text-2xl font-bold tracking-tight">Cadastro</h1>
                </div>

                {state.submitSuccess && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md justify-center flex flex-row gap-3">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAACD0lEQVR4nM1WP2sUURBfxUYtlLuZ29MIGtCIqI2iXpKZXVDyCQRLK0kl2CiWv9m9CKLoJzBWBr9AJCkULGy0sPZPpxwm2PgRZDZncuutm93jOBxYHvvezO838968mRcE/4sQZJGgzznR603MHfWRIc8IemssBAw1hn4ii+4QZJ0hv3z0fzb9zKbJqMB32eQNmfxgk/ftB8JFej7v665H0NduV5EgPkmQjVYSLTSWOlNVbBpLnSnXdztKo1O7GhDkkX+VPKpti3gfQ1IPPezqdDCChF2dzrYYkjrekAJDVtnkFSNu1wJO588y9PYOTtzewpHVIpIvBJmp5TqCvQR95yk+ON1M50575hWRfGgm0aU6HORpDH0bBMGewfkwkSuedTnl8PHCQTbtNdLoTFWCEPEJMvlZFL3jON4RXDywE4VpwpAXtaKArLPJ/X+ts8mKX+RBkp6H+Leib1+7O3t8CADzNxnysTCDclumvXwkJisF3i4y5Fsrjc5vG2O2lV066IWySLNIBktO2ZkQoht90Kjv0EuCPiwj+HMmjls5u5rQq2S6ydCnnurHnnT2l5JALzve0AKZfC2rOyHic2zyvZXItTKCDAsy486MdOMPIT68G0HpjZ9I7ZpMFZ5kP8l1RshGtc6om67PpveCUWSr5PR7vOla1uNN17Z7vO//OMRfJWy6nHutmC6P7bUyDvkNKEfqWvhHuk8AAAAASUVORK5CYII=" alt="approval--v1" />
                        Cadastro realizado com sucesso!
                    </div>
                )}

                {state.submitError && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md justify-center flex flex-row gap-3 items-center">
                        <img src="/assets/alert_error_icon.png" alt="error--v1" />
                        {state.submitError}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <SelectFormField
                            control={form.control}
                            name="tipo"
                            label="Tipo de Usuário"
                            options={[
                                { value: "selecione", label: "Selecione" },
                                { value: "alunos", label: "Alunos" },
                                { value: "professores", label: "Professores" },
                                { value: "disciplinas", label: "Disciplinas" }

                            ]}
                            placeholder="Selecione o tipo de usuário"
                            disabled={state.isSubmitting}
                        />

                        {tipo && tipo !== "selecione" && renderFormByType()}

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={state.isSubmitting || !tipo || tipo === "selecione"}
                        >
                            {state.isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
export default function Cadastro() {
    return <CadastroForm />;
}
