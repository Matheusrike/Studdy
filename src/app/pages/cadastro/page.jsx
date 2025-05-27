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
import { ExternalLink, GraduationCap, Calendar, BookOpen, School, Search, Star, StarOff, Shield, Briefcase, Building2, Landmark, Scale } from "lucide-react";
import Alert from "@/components/ui/alerts";

const CONCURSOS_ICON_OPTIONS = [
    { label: 'Escudo', value: 'Shield', icon: Shield },
    { label: 'Escola', value: 'School', icon: School },
    { label: 'Pasta', value: 'Briefcase', icon: Briefcase },
    { label: 'Prédio', value: 'Building2', icon: Building2 },
    { label: 'Monumento', value: 'Landmark', icon: Landmark },
    { label: 'Balança', value: 'Scale', icon: Scale }
];

const VESTIBULARES_ICON_OPTIONS = [
    { label: 'Graduação', value: 'GraduationCap', icon: GraduationCap },
    { label: 'Livro', value: 'BookOpen', icon: BookOpen },
    { label: 'Escola', value: 'School', icon: School },
    { label: 'Calendário', value: 'Calendar', icon: Calendar }
];

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

const formSchema = z.object({
    tipo: z.string().min(1, "Selecione um tipo de usuário"),
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido").optional().or(z.literal('')),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal('')),
    cpf: z.string().min(11, "CPF deve ter 11 dígitos").optional().or(z.literal('')),
    birth_date: z.string().optional().or(z.literal('')),
    class: z.string().min(1, "Selecione uma turma").optional().or(z.literal('')),
    curso: z.string().optional().or(z.literal('')),
    formacao: z.string().optional().or(z.literal('')),
    area: z.string().optional().or(z.literal('')),
    descricao: z.string().optional().or(z.literal('')),
    horario: z.string().optional().or(z.literal('')),
    data: z.string().optional().or(z.literal('')),
    icone: z.string().optional().or(z.literal('')),
    color: z.string().optional().or(z.literal('')),
    tipo_concurso: z.string().optional().or(z.literal('')),
    link: z.string().optional().or(z.literal('')),
    category: z.string().optional().or(z.literal('')),
    shift: z.string().min(1, "Turno é obrigatório").optional().or(z.literal('')),
    course: z.string().min(1, "Curso é obrigatório").optional().or(z.literal('')),
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
                label: area 
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
                label: area 
            }))}
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
        <SelectFormField
            control={control}
            name="class"
            label="Turma"
            options={turmas.map(turma => ({ 
                value: turma.id.toString(), 
                label: `${turma.name} - ${turma.shift} (${turma.course})` 
            }))}
            placeholder="Selecione uma turma"
            disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isLoading && <p className="text-sm text-muted-foreground">Carregando turmas...</p>}
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
            options={CONCURSOS_ICON_OPTIONS}
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
            options={VESTIBULARES_ICON_OPTIONS}
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
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [turmas, setTurmas] = useState([]);
    const [isLoadingTurmas, setIsLoadingTurmas] = useState(true);
    const [errorTurmas, setErrorTurmas] = useState(null);

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

    useEffect(() => {
        const fetchTurmas = async () => {
            try {
                setIsLoadingTurmas(true);
                setErrorTurmas(null);
                console.log('Iniciando busca de turmas...');

                const response = await fetch('http://localhost:3001/class', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                console.log('Resposta recebida:', response.status);

                const data = await response.json();
                console.log('Dados recebidos:', data);
                
                setTurmas(data);
            } catch (error) {
                console.error('Erro ao buscar turmas:', error);
                setErrorTurmas(error.message || 'Não foi possível carregar as turmas');
            } finally {
                setIsLoadingTurmas(false);
            }
        };

        fetchTurmas();
    }, []);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                console.log("Iniciando busca de áreas...");
                
                const response = await fetch('http://localhost:3001/subject', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                console.log("Resposta recebida:", response.status);


                const data = await response.json();
                console.log("Dados recebidos:", data);

                // Ajustando para a estrutura do Prisma
                const areasList = data.map(item => item.name);
                console.log("Lista de áreas processada:", areasList);
                
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

    const getEndpoint = (tipo) => {
        const endpoints = {
            alunos: "http://localhost:3001/student",
            professores: "http://localhost:3001/teacher",
            turmas: "http://localhost:3001/class",
            concursos: "http://localhost:3001/contest",
            vestibulares: "http://localhost:3001/vestibular",
            disciplinas: "http://localhost:3001/subject"
        };
        return endpoints[tipo] || null;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatPayloadForConcursos = (data) => {
        const selectedIcon = CONCURSOS_ICON_OPTIONS.find(opt => opt.value === data.icone);
        const formattedDate = formatDate(data.data);

        return {
            title: data.name,
            description: data.descricao,
            link: data.link || "#",
            icon: selectedIcon ? selectedIcon.value : 'Star',
            color: `bg-${data.color.replace('#', '')}`,
            date: formattedDate,
            category: data.tipo_concurso || "geral"
        };
    };

    const formatPayloadForMaterias = (data) => {
        return {
            name: data.name
        };
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);

            const endpoint = getEndpoint(data.tipo);
            if (!endpoint) throw new Error("Tipo de cadastro inválido");

            // Limpa os dados antes de enviar
            const cleanData = {
                disciplinas: {
                    name: data.name
                },
                professores: {
                    user: {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        cpf: data.cpf.replace(/\D/g, ''),
                        birth_date: formatDate(data.birth_date),
                        role: "Teacher"
                    },
                    teacher: {
                        subjects: [parseInt(data.area || '1'),parseInt(data.area2 || '2')].filter(id => !isNaN(id))
                    }
                },
                alunos: {
                    user: {
                        name: data.name,
                        email: data.email,
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
                    name: data.name,
                    shift: data.shift,
                    course: data.course
                }
            }[data.tipo];

            console.log("Dados do formulário:", data);
            console.log("Payload a ser enviado:", JSON.stringify(cleanData, null, 2));
            console.log("Endpoint:", endpoint);

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

            console.log("Status da resposta:", response.status);
            
            // Verifica se a resposta tem conteúdo antes de tentar fazer o parse
            const responseText = await response.text();
            console.log("Resposta bruta do servidor:", responseText);
            
            let responseData;
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error("Erro ao fazer parse da resposta:", e);
                responseData = { message: "Erro ao processar resposta do servidor" };
            }
            
            console.log("Resposta processada:", responseData);

            if (!response.ok) {
                throw new Error(responseData.message || `Erro ao cadastrar: ${response.status}`);
            }

            setSubmitSuccess(true);
            form.reset();
        } catch (error) {
            console.error("Erro no cadastro:", error);
            setSubmitError(error.message);
            setSubmitSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFormByType = () => {
        switch (tipo) {
            case "disciplinas":
                return <DisciplinaForm control={form.control} />;
            case "professores":
                return <ProfessorForm 
                    control={form.control} 
                    areas={areas} 
                    turmas={turmas}
                    isLoading={isLoading} 
                    error={error} 
                />;
            case "alunos":
                return <AlunoForm 
                    control={form.control} 
                    turmas={turmas} 
                    isLoading={isLoadingTurmas} 
                    error={errorTurmas} 
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

                {submitSuccess && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md justify-center flex flex-row gap-3">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAACD0lEQVR4nM1WP2sUURBfxUYtlLuZ29MIGtCIqI2iXpKZXVDyCQRLK0kl2CiWv9m9CKLoJzBWBr9AJCkULGy0sPZPpxwm2PgRZDZncuutm93jOBxYHvvezO838968mRcE/4sQZJGgzznR603MHfWRIc8IemssBAw1hn4ii+4QZJ0hv3z0fzb9zKbJqMB32eQNmfxgk/ftB8JFej7v665H0NduV5EgPkmQjVYSLTSWOlNVbBpLnSnXdztKo1O7GhDkkX+VPKpti3gfQ1IPPezqdDCChF2dzrYYkjrekAJDVtnkFSNu1wJO588y9PYOTtzewpHVIpIvBJmp5TqCvQR95yk+ON1M50575hWRfGgm0aU6HORpDH0bBMGewfkwkSuedTnl8PHCQTbtNdLoTFWCEPEJMvlZFL3jON4RXDywE4VpwpAXtaKArLPJ/X+ts8mKX+RBkp6H+Leib1+7O3t8CADzNxnysTCDclumvXwkJisF3i4y5Fsrjc5vG2O2lV066IWySLNIBktO2ZkQoht90Kjv0EuCPiwj+HMmjls5u5rQq2S6ydCnnurHnnT2l5JALzve0AKZfC2rOyHic2zyvZXItTKCDAsy486MdOMPIT68G0HpjZ9I7ZpMFZ5kP8l1RshGtc6om67PpveCUWSr5PR7vOla1uNN17Z7vO//OMRfJWy6nHutmC6P7bUyDvkNKEfqWvhHuk8AAAAASUVORK5CYII=" alt="approval--v1" />
                        Cadastro realizado com sucesso!
                    </div>
                )}

                {submitError && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md justify-center flex flex-row gap-3 items-center">
                        <img src="/assets/alert_error_icon.png" alt="error--v1" />
                        {submitError}
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
                            disabled={isSubmitting}
                        />

                        {tipo && tipo !== "selecione" && renderFormByType()}

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isSubmitting || !tipo || tipo === "selecione"}
                        >
                            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
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