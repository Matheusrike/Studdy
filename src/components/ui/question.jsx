'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { MinusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Cookies from 'js-cookie';

import Alert from "@/components/ui/alerts";

const formSchema = z.object({
    question: z.string().min(1, "Digite uma question"),
    correct_answer: z.string().min(1, "Digite a resposta correta"),
});

function QuestionForm({ questionId, numeroQuestao, onAddQuestion, onDeleteQuestion, onAlternativesGenerated, existingQuestion }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [alternativas, setAlternativas] = useState({
        alternativa1: '',
        alternativa2: '',
        alternativa3: ''
    });

    // Função para enviar dados atualizados para o componente pai
    const updateParentData = (questionText, correctAnswer, alts) => {
        if (questionText && correctAnswer && (alts.alternativa1 || alts.alternativa2 || alts.alternativa3)) {
            onAlternativesGenerated({
                questionId: questionId,
                question: questionText,
                correct_answer: correctAnswer,
                alternativas: alts
            });
        }
    };

    // Atualizar dados quando alternativas mudarem
    useEffect(() => {
        const currentQuestion = form.getValues('question');
        const currentCorrectAnswer = form.getValues('correct_answer');
        if (currentQuestion && currentCorrectAnswer) {
            updateParentData(currentQuestion, currentCorrectAnswer, alternativas);
        }
    }, [alternativas]);

    // Atualizar dados quando pergunta ou resposta correta mudarem
    const handleFormChange = () => {
        const currentQuestion = form.getValues('question');
        const currentCorrectAnswer = form.getValues('correct_answer');
        if (currentQuestion && currentCorrectAnswer) {
            updateParentData(currentQuestion, currentCorrectAnswer, alternativas);
        }
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            correct_answer: ""
        },
    });

    // Carregar dados existentes da questão no modo de edição
    useEffect(() => {
        if (existingQuestion) {
            form.setValue('question', existingQuestion.statement || '');
            
            // Encontrar a alternativa correta
            const correctAlternative = existingQuestion.alternatives?.find(alt => alt.isCorrect);
            if (correctAlternative) {
                form.setValue('correct_answer', correctAlternative.text || '');
            }
            
            // Carregar alternativas incorretas
            const incorrectAlternatives = existingQuestion.alternatives?.filter(alt => !alt.isCorrect) || [];
            const newAlternativas = {
                alternativa1: incorrectAlternatives[0]?.text || '',
                alternativa2: incorrectAlternatives[1]?.text || '',
                alternativa3: incorrectAlternatives[2]?.text || ''
            };
            setAlternativas(newAlternativas);
            
            // Atualizar dados no componente pai
            if (existingQuestion.statement && correctAlternative) {
                updateParentData(existingQuestion.statement, correctAlternative.text, newAlternativas);
            }
        }
    }, [existingQuestion]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);
            setAlternativas({
                alternativa1: '',
                alternativa2: '',
                alternativa3: ''
            });

            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const payload = {
                question: data.question,
                correct_answer: data.correct_answer
            };

            const response = await fetch(`http://localhost:3000/generate/generate-alternatives`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || errorData.error || 'Erro ao gerar alternativas';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log(`Alternativas geradas:`, result);

            if (result.incorrectAnswers && result.incorrectAnswers.length >= 3) {
                const novasAlternativas = {
                    alternativa1: result.incorrectAnswers[0].trim(),
                    alternativa2: result.incorrectAnswers[1].trim(),
                    alternativa3: result.incorrectAnswers[2].trim()
                };
                setAlternativas(novasAlternativas);
                setSubmitSuccess(true);
                
                // Passa as alternativas geradas para o componente pai
                onAlternativesGenerated({
                    questionId: questionId,
                    question: data.question,
                    correct_answer: data.correct_answer,
                    alternativas: novasAlternativas
                });
            } else {
                throw new Error('Não foi possível gerar as alternativas corretamente');
            }

        } catch (error) {
            console.error(error);
            setSubmitError(error.message || 'Erro ao gerar alternativas');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Questão {numeroQuestao}</h2>

            <Alert
                submitSuccess={submitSuccess}
                submitError={submitError}
                successMessage="Alternativas geradas com sucesso!"
                errorMessage="Erro ao gerar alternativas"
            />

            <Form {...form}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pergunta</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Digite sua question"
                                        {...field}
                                        disabled={isSubmitting}
                                        className="min-h-[100px] resize-none focus-visible:border-[#1e40af] focus-visible:ring-[#1e40af] focus-visible:ring-[3px]"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTimeout(handleFormChange, 100);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="correct_answer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green-500">Resposta Correta</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Digite a resposta correta"
                                        {...field}
                                        disabled={isSubmitting}
                                        className="focus-visible:border-green-500 focus-visible:ring-green-500/50 focus-visible:ring-[3px]"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTimeout(handleFormChange, 100);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormItem>
                            <FormLabel className="text-red-500">Alternativa Incorreta 1</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Clique em 'Gerar Alternativas' para preencher automaticamente"
                                    value={alternativas.alternativa1}
                                    onChange={(e) => {
                                        setAlternativas(prev => ({
                                            ...prev,
                                            alternativa1: e.target.value
                                        }));
                                        setTimeout(handleFormChange, 100);
                                    }}
                                    className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                />
                            </FormControl>
                        </FormItem>

                        <FormItem>
                            <FormLabel className="text-red-500">Alternativa Incorreta 2</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Clique em 'Gerar Alternativas' para preencher automaticamente"
                                    value={alternativas.alternativa2}
                                    onChange={(e) => {
                                        setAlternativas(prev => ({
                                            ...prev,
                                            alternativa2: e.target.value
                                        }));
                                        setTimeout(handleFormChange, 100);
                                    }}
                                    className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                />
                            </FormControl>
                        </FormItem>

                        <FormItem>
                            <FormLabel className="text-red-500">Alternativa Incorreta 3</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Clique em 'Gerar Alternativas' para preencher automaticamente"
                                    value={alternativas.alternativa3}
                                    onChange={(e) => {
                                        setAlternativas(prev => ({
                                            ...prev,
                                            alternativa3: e.target.value
                                        }));
                                        setTimeout(handleFormChange, 100);
                                    }}
                                    className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                />
                            </FormControl>
                        </FormItem>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            className="flex-1"
                            disabled={isSubmitting}
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            {isSubmitting ? 'Gerando...' : 'Gerar Alternativas'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onDeleteQuestion}
                            className="flex items-center gap-2 bg-red-700 text-white hover:bg-red-600"
                        >
                            <MinusCircle className="h-4 w-4" />
                            Excluir Questão 
                        </Button>
                    </div>
                </div>
            </Form>
            <Separator className="my-10" />
        </div>
    );
}

export default function Question({ questionId, numeroQuestao, onAddQuestion, onDeleteQuestion, onAlternativesGenerated }) {
    return <QuestionForm 
        questionId={questionId}
        numeroQuestao={numeroQuestao} 
        onAddQuestion={onAddQuestion} 
        onDeleteQuestion={onDeleteQuestion}
        onAlternativesGenerated={onAlternativesGenerated}
    />;
}