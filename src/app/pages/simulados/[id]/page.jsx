'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { handleUnexpectedError } from "@/utils/errorHandler";
import Image from "next/image";
import { QuizVisibility } from "../enums/QuizVisibility";
import { useUser } from "@/contexts/UserContext";
import Cookies from "js-cookie";


export default function SimuladoQuestoesPage() {
    const params = useParams();
    const router = useRouter();
    const { userRole } = useUser();
    const [simulado, setSimulado] = useState(null);
    const [questoes, setQuestoes] = useState([]);
    const [respostasUsuario, setRespostasUsuario] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para indicar se o simulado já foi concluído
    const [concluido, setConcluido] = useState(false);

    // Função para embaralhar array (Fisher-Yates shuffle)
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Função para embaralhar questões e suas alternativas
    const shuffleQuestionsAndAlternatives = (questions) => {
        // Embaralha as questões
        const shuffledQuestions = shuffleArray(questions);
        
        // Para cada questão, embaralha suas alternativas
        return shuffledQuestions.map(question => ({
            ...question,
            alternatives: shuffleArray(question.alternatives)
        }));
    };
    
    // Determinar o modo de visualização baseado no status
    const getViewMode = () => {
        if (!simulado) return 'loading';
        
        switch (simulado.visibility) {
            case QuizVisibility.DRAFT:
                // Draft: não pode ser visualizado
                return 'restricted';
            case QuizVisibility.PUBLIC:
                // Published: todos podem responder
                return 'answer';
            case QuizVisibility.ARCHIVED:
                // Archived: apenas visualizar resultado
                return 'result';
            default:
                return 'result';
        }
    };
    
    const viewMode = getViewMode();
    const showAnswerStyles = viewMode === 'result' || concluido;


    useEffect(() => {
        const fetchSimuladoDetalhes = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Requisitar dados do quiz da API
                const response = await fetch(`http://localhost:3000/quiz/${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Erro ao buscar simulado: ${response.status}`);
                }
                
                const quizData = await response.json();
                
                // Adaptar os dados recebidos para o formato esperado pelo componente
                const simuladoData = {
                    id: quizData.id,
                    title: quizData.title,
                    description: quizData.description,
                    max_attempts: 1, // Valor padrão se não vier da API
                    duration_minutes: quizData.duration_minutes,
                    visibility: quizData.visibility || QuizVisibility.PUBLIC
                };
                
                setSimulado(simuladoData);
                // Embaralha questões e alternativas antes de definir no estado
                const shuffledQuestions = shuffleQuestionsAndAlternatives(quizData.questions);
                setQuestoes(shuffledQuestions);

                // Inicialmente não concluído
                setConcluido(false);

            } catch (error) {
                handleUnexpectedError(error, 'carregar página do simulado');
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchSimuladoDetalhes();
        }
    }, [params.id]);

    const handleRespostaChange = (questaoId, alternativa) => {
        if (viewMode !== 'answer' || concluido) return; // Só permite alteração no modo resposta e não concluído
        setRespostasUsuario(prev => ({
            ...prev,
            [questaoId]: alternativa
        }));
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 text-center">
                <span className="text-gray-600">Carregando...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 text-center text-red-500">
                {error}
            </div>
        );
    }

    // Se o modo for 'restricted', mostrar mensagem de acesso negado
    if (viewMode === 'restricted') {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/pages/simulados" className="flex items-center text-blue-600 hover:underline font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para Simulados
                    </Link>
                </div>
                <Card className="shadow-lg rounded-2xl border border-red-200">
                    <CardContent className="text-center py-10">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Restrito</h2>
                        <p className="text-gray-600">
                            Este simulado está em modo rascunho e não está disponível para estudantes.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const status = (() => {
        switch (simulado?.visibility) {
            case QuizVisibility.DRAFT:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Rascunho</span>;
            case QuizVisibility.PUBLIC:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Publicado</span>;
            case QuizVisibility.ARCHIVED:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Arquivado</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Desconhecido</span>;
        }
    })();
    


    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Link href="/pages/simulados" className="flex items-center text-blue-600 hover:underline font-medium">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Simulados
                </Link>
            </div>

            <Card className="mb-6 shadow-lg rounded-2xl border border-gray-200">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl font-bold text-gray-800 flex-1">
                            {simulado?.title.toUpperCase()}
                        </CardTitle>
                    </div>
                    <div className="text-sm text-gray-700 font-semibold flex flex-col lg:flex-row md:flex-row md:justify-between lg:justify-between gap-2 align-center mt-4 ">
                        <p>Tentativas máximas: {simulado?.max_attempts}</p>
                        <p>Duração: {simulado?.duration_minutes} minutos</p>
                        <p>Status: {status}</p>
                    </div>
                    {simulado?.description && (
                        <p className="mt-4 text-gray-600">{simulado.description}</p>
                    )}
                </CardHeader>
            </Card>

            {questoes.map((questao, index) => (
                <Card key={questao.id} className="mb-6 shadow-md border border-gray-200 rounded-xl">
                    <CardHeader className="mb-2">
                        <CardTitle className="text-xl mb-4 font-bold flex justify-between items-center ">
                            Questão {index + 1}
                            <span className="text-sm text-gray-500">Pontos: {questao.points}</span>
                        </CardTitle>
                        <p className="text-gray-800">{questao.statement}</p>

                        {questao.image && (
                            <div className="relative w-full h-64 my-4 rounded-lg overflow-hidden ">
                                <Image
                                    src={questao.image}
                                    alt={`Imagem da questão ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {questao.alternatives.map((alternativa) => {
                                // Define a classe para alternativas corretas e para a seleção do usuário
                                const isSelected = respostasUsuario[questao.id] === alternativa.id;
                                const isCorrect = alternativa.correct_alternative;

                                // Se concluído ou expirado, mostrar corretas em verde e demais neutras
                                const showAnswerStyles = (concluido || simulado?.visibility !== QuizVisibility.PUBLIC);

                                let alternativeClass = 'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ';



                                if (showAnswerStyles) {
                                    if (isCorrect) {
                                        alternativeClass += ' border-green-600 bg-green-100 cursor-default';

                                    } else if (isSelected) {
                                        alternativeClass += ' border-red-600 bg-red-100 cursor-default';

                                    } else {
                                        alternativeClass += ' border-gray-300 bg-white cursor-default';
                                    }
                                } else {
                                    alternativeClass += isSelected
                                        ? 'border-[#133d86] bg-blue-100'
                                        : 'border-gray-300 hover:bg-gray-50';
                                }

                                return (
                                    <div
                                        key={alternativa.id}
                                        className={alternativeClass}
                                        onClick={() => handleRespostaChange(questao.id, alternativa.id)}
                                    >
                                        {viewMode === 'answer' ? (
                                            <input
                                                type="radio"
                                                id={`questao-${questao.id}-${alternativa.id}`}
                                                name={`questao-${questao.id}`}
                                                value={alternativa.id}
                                                checked={isSelected}
                                                onChange={() => handleRespostaChange(questao.id, alternativa.id)}
                                                className={`mt-1 h-4 w-4 accent-blue-600`}
                                                disabled={concluido}
                                            />
                                        ) : viewMode === 'result' ? (
                                            <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                                isCorrect ? 'border-green-600 bg-green-100' : 
                                                isSelected ? 'border-red-600 bg-red-100' : 'border-gray-300'
                                            }`}>
                                                {(isCorrect || isSelected) && (
                                                    <div className={`h-2 w-2 rounded-full ${
                                                        isCorrect ? 'bg-green-600' : 'bg-red-600'
                                                    }`} />
                                                )}
                                            </div>
                                        ) : null}
                                        <label htmlFor={`questao-${questao.id}-${alternativa.id}`} className="text-sm text-gray-800 leading-5 select-none">
                                            <strong>{String.fromCharCode(65 + questao.alternatives.findIndex(alt => alt.id === alternativa.id))})</strong> {alternativa.response}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Botão Finalizar aparece no modo 'answer' e não concluído */}
            {(viewMode === 'answer' && !concluido) && (
                <div className="flex justify-end mt-10">
                    <Button
                        variant="default"
                        size="lg"
                        className={`w-full py-6 text-base font-bold rounded-xl transition 
                            ${Object.keys(respostasUsuario).length !== questoes.length
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#133d86] hover:bg-blue-600'}
                        `}
                        disabled={Object.keys(respostasUsuario).length !== questoes.length}
                        onClick={() => setConcluido(true)} // Simular conclusão ao clicar
                    >
                        <Send className="h-5 w-5 mr-2" />
                        Finalizar Simulado
                    </Button>
                </div>
            )}
            

            
            {/* Mensagem informativa para modo resultado */}
            {viewMode === 'result' && (
                <div className="text-center mt-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 font-medium">
                        Este simulado está arquivado. Você está visualizando apenas o resultado.
                    </p>
                </div>
            )}
            
            {/* Mensagem informativa para usuários que concluíram */}
            {(concluido && viewMode === 'answer') && (
                <div className="text-center mt-10 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 font-medium">
                        ✅ Simulado concluído! As respostas corretas estão destacadas em verde.
                    </p>
                </div>
            )}
        </div>
    );
}
