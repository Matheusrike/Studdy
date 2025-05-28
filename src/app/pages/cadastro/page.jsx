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
import Logo from '@/components/ui/logo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Calendar, BookOpen, School, Shield, Briefcase, Building2, Landmark, Scale } from "lucide-react";

const SHIFT_OPTIONS = [
    { value: 'Morning', label: 'Manhã' },
    { value: 'Afternoon', label: 'Tarde' },
    { value: 'Evening', label: 'Noite' }
];

const CONCURSO_CATEGORIES = [
    { value: 'militares', label: 'Militares' },
    { value: 'federais', label: 'Federais' },
    { value: 'estaduais', label: 'Estaduais' },
    { value: 'municipais', label: 'Municipais' }
];

const VESTIBULAR_CATEGORIES = [
    { value: 'publico', label: 'Público' },
    { value: 'privado', label: 'Privado' }
];

const ICON_OPTIONS = {
    concursos: [
        { label: 'Escudo', value: 'Shield', icon: Shield },
        { label: 'Escola', value: 'School', icon: School },
        { label: 'Pasta', value: 'Briefcase', icon: Briefcase },
        { label: 'Prédio', value: 'Building2', icon: Building2 },
        { label: 'Monumento', value: 'Landmark', icon: Landmark },
        { label: 'Balança', value: 'Scale', icon: Scale }
    ],
    vestibulares: [
        { label: 'Graduação', value: 'GraduationCap', icon: GraduationCap },
        { label: 'Livro', value: 'BookOpen', icon: BookOpen },
        { label: 'Escola', value: 'School', icon: School },
        { label: 'Calendário', value: 'Calendar', icon: Calendar }
    ]
};

const CATEGORIES = {
    concurso: [
        { value: 'militares', label: 'Militares' },
        { value: 'federais', label: 'Federais' },
        { value: 'estaduais', label: 'Estaduais' },
        { value: 'municipais', label: 'Municipais' }
    ],
    vestibular: [
        { value: 'publico', label: 'Público' },
        { value: 'privado', label: 'Privado' }
    ]
};

const ENDPOINTS = {
    alunos: "http://localhost:3001/admin/students",
    professores: "http://localhost:3001/admin/teachers",
    turmas: "http://localhost:3001/admin/classes",
    concursos: "http://localhost:3001/admin/contest",
    vestibulares: "http://localhost:3001/admin/vestibular",
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
    formacao: z.string().max(100, "Formação deve ter no máximo 100 caracteres").optional().or(z.literal('')),
    area: z.string().optional().or(z.literal('')),
    descricao: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional().or(z.literal('')),
    horario: z.string().optional().or(z.literal('')),
    data: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
        .optional()
        .or(z.literal('')),
    icone: z.string().optional().or(z.literal('')),
    color: z.string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida")
        .optional()
        .or(z.literal('')),
    tipo_concurso: z.string().optional().or(z.literal('')),
    link: z.string()
        .url("Link inválido")
        .optional()
        .or(z.literal('')),
    category: z.string().optional().or(z.literal('')),
    shift: z.string().min(1, "Turno é obrigatório").optional().or(z.literal('')),
    course: z.string().min(1, "Curso é obrigatório").optional().or(z.literal('')),
}).refine((data) => {
    // Validações específicas por tipo
    if (data.tipo === 'professores' || data.tipo === 'alunos') {
        return data.email && data.password && data.cpf && data.birth_date;
    }
    if (data.tipo === 'turmas') {
        return data.shift && data.course;
    }
    if (data.tipo === 'concursos' || data.tipo === 'vestibulares') {
        return data.data && data.tipo_concurso;
    }
    return true;
}, {
    message: "Preencha todos os campos obrigatórios",
    path: ["tipo"]
});

// Componentes de Formulário
const BaseFormField = ({ control, name, label, type = "text", placeholder, ...props }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} {...props} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const SelectFormField = ({ control, name, label, options, placeholder, disabled }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={disabled}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
);

const IconSelector = ({ control, name, label, options, form }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <div className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            {options.map(opt => {
                                const Icon = opt.icon;
                                return (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => field.onChange(opt.value)}
                                        className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${field.value === opt.value ? 'bg-[#133D86] text-white border-[#133D86] scale-110 shadow-lg' : 'bg-white text-[#133D86] border-gray-200 hover:bg-[#e6eefc]'} `}
                                        title={opt.label}
                                        style={{
                                            backgroundColor: field.value === opt.value ? form.watch("color") : 'white',
                                            color: field.value === opt.value ? 'white' : form.watch("color"),
                                            borderColor: field.value === opt.value ? form.watch("color") : '#e5e7eb'
                                        }}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </button>
                                );
                            })}
                        </div>
                        <FormField
                            control={control}
                            name="color"
                            render={({ field: colorField }) => (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">
                                        Cor do Ícone:
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="color"
                                            {...colorField}
                                            className="w-12 h-8 p-0 rounded border cursor-pointer"
                                            style={{
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {colorField.value}
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

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

const TurmaForm = ({ control }) => (
    <>
        <BaseFormField
            control={control}
            name="name"
            label="Nome da Turma"
            placeholder="Nome da Turma"
        />
        <SelectFormField
            control={control}
            name="shift"
            label="Turno"
            options={SHIFT_OPTIONS}
            placeholder="Selecione o turno"
        />
        <BaseFormField
            control={control}
            name="course"
            label="Curso"
            placeholder="Nome do Curso"
        />
    </>
);

const ConcursoForm = ({ control, form }) => (
    <>
        <BaseFormField
            control={control}
            name="name"
            label="Nome do Concurso"
            placeholder="Nome do Concurso"
        />
        <BaseFormField
            control={control}
            name="link"
            label="Link do Concurso"
            placeholder="https://..."
        />
        <SelectFormField
            control={control}
            name="tipo_concurso"
            label="Categoria"
            options={CONCURSO_CATEGORIES}
            placeholder="Selecione a categoria"
        />
        <BaseFormField
            control={control}
            name="data"
            label="Data do Concurso"
            type="date"
        />
        <IconSelector
            control={control}
            name="icone"
            label="Ícone"
            options={ICON_OPTIONS.concursos}
            form={form}
        />
        <BaseFormField
            control={control}
            name="descricao"
            label="Descrição"
            placeholder="Descrição do concurso"
        />
    </>
);

const VestibularForm = ({ control, form }) => (
    <>
        <BaseFormField
            control={control}
            name="name"
            label="Nome do Vestibular"
            placeholder="Nome do Vestibular"
        />
        <BaseFormField
            control={control}
            name="link"
            label="Link do Vestibular"
            placeholder="https://..."
        />
        <SelectFormField
            control={control}
            name="tipo_concurso"
            label="Categoria"
            options={VESTIBULAR_CATEGORIES}
            placeholder="Selecione a categoria"
        />
        <BaseFormField
            control={control}
            name="data"
            label="Data do Vestibular"
            type="date"
        />
        <IconSelector
            control={control}
            name="icone"
            label="Ícone"
            options={ICON_OPTIONS.vestibulares}
            form={form}
        />
        <BaseFormField
            control={control}
            name="descricao"
            label="Descrição"
            placeholder="Descrição do vestibular"
        />
    </>
);

function CadastroForm() {
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
            shift: "",
            course: "",
            data: "",
            icone: "",
            color: "#133D86",
            class: "",
            tipo_concurso: "",
            link: "",
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
            },
            turmas: {
                name: data.name.trim(),
                shift: data.shift,
                course: data.course.trim()
            },
            concursos: {
                title: data.name.trim(),
                description: data.descricao.trim(),
                link: data.link.trim() || "#",
                icon: data.icone || 'Star',
                color: `bg-${data.color.replace('#', '')}`,
                date: formatDate(data.data),
                category: data.tipo_concurso || "geral"
            },
            vestibulares: {
                title: data.name.trim(),
                description: data.descricao.trim(),
                link: data.link.trim() || "#",
                icon: data.icone || 'GraduationCap',
                color: data.color,
                date: formatDate(data.data),
                type: data.tipo_concurso || "publico"
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
            case "turmas":
                return <TurmaForm control={form.control} />;
            case "concursos":
                return <ConcursoForm control={form.control} form={form} />;
            case "vestibulares":
                return <VestibularForm control={form.control} form={form} />;
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
                                { value: "turmas", label: "Turmas" },
                                { value: "disciplinas", label: "Disciplinas" },
                                { value: "concursos", label: "Concursos" },
                                { value: "vestibulares", label: "Vestibulares" }
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