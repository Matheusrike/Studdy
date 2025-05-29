'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { handleUnexpectedError } from "@/utils/errorHandler";
import Image from "next/image";

export default function SimuladoQuestoesPage() {
    const params = useParams();
    const [simulado, setSimulado] = useState(null);
    const [questoes, setQuestoes] = useState([]);
    const [respostasUsuario, setRespostasUsuario] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para indicar se o simulado já foi concluído
    const [concluido, setConcluido] = useState(false);
    const showAnswerStyles = simulado?.visibility !== "published";


    useEffect(() => {
        const fetchSimuladoDetalhes = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // const response = await fetch(`http://localhost:3001/simulados/${params.id}`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     }
                // });
                // await handleApiError(response, 'buscar simulado');
                // const simuladoData = await response.json();
                // setSimulado(simuladoData);





                const simuladoData = {
                    id: params.id,
                    title: "titulo do questionario",
                    teacher_subject_class_id: 1,
                    max_attempts: 1,
                    duration_minutes: 60,
                    visibility: "published" // Altere para testar "draft" ou outro para simular expirado
                };
                setSimulado(simuladoData);

                const questoesData = [
                    {
                        id: 1,
                        statement: "Em um experimento científico sobre fotossíntese, observou-se que uma planta em condições ideais de luz, água e temperatura produziu 45g de glicose em 3 horas. Considerando que a taxa de produção de glicose permanece constante e que as condições ambientais não se alteram, qual seria a produção total de glicose desta planta após 12 horas de experimento?",
                        image: "/assets/leia-sp.png",
                        points: 10,
                        alternatives: [
                            { id: 'a', response: '180g de glicose, pois a produção em 12 horas será 4 vezes maior que em 3 horas', correct_alternative: true },
                            { id: 'b', response: '90g de glicose, pois a taxa de produção diminui com o tempo', correct_alternative: false },
                            { id: 'c', response: '135g de glicose, pois a fotossíntese é mais eficiente nas primeiras horas', correct_alternative: false },
                            { id: 'd', response: '225g de glicose, pois a eficiência da fotossíntese aumenta progressivamente', correct_alternative: false }
                        ]
                    },
                    {
                        id: 2,
                        statement: "Durante o período colonial brasileiro, especificamente no século XVIII, a região de Minas Gerais vivenciou um intenso ciclo de exploração do ouro, que ficou conhecido como o Ciclo do Ouro. Este período foi marcado por profundas transformações sociais, econômicas e culturais na colônia. Entre os eventos históricos relacionados a este período, destaca-se a Inconfidência Mineira (1789), que representou uma importante tentativa de independência. Considerando o contexto histórico apresentado, qual das alternativas melhor descreve as características deste movimento?",
                        image: "",
                        points: 10,
                        alternatives: [
                            { id: 'a', response: 'Foi um movimento liderado principalmente por membros da elite colonial, incluindo intelectuais, militares e proprietários de terra, que se inspiraram nos ideais iluministas e na independência dos Estados Unidos para propor a libertação da região das Minas Gerais do domínio português', correct_alternative: true },
                            { id: 'b', response: 'Tratou-se de uma revolta popular, organizada principalmente por escravos e trabalhadores das minas, que buscavam melhores condições de trabalho e o fim da escravidão', correct_alternative: false },
                            { id: 'c', response: 'Foi uma manifestação pacífica organizada pela Igreja Católica contra os impostos excessivos cobrados pela Coroa Portuguesa sobre a produção de ouro', correct_alternative: false },
                            { id: 'd', response: 'Representou uma aliança entre mineradores portugueses e brasileiros que buscavam maior autonomia administrativa, sem questionar a autoridade da Coroa Portuguesa', correct_alternative: false }
                        ]
                    },
                    {
                        id: 3,
                        statement: "O aquecimento global é um dos maiores desafios ambientais enfrentados pela humanidade no século XXI. Diversos estudos científicos têm demonstrado uma correlação direta entre o aumento das temperaturas globais e a elevação dos níveis de gases de efeito estufa na atmosfera. Considerando os impactos deste fenômeno nos ecossistemas terrestres e marinhos, analise as seguintes afirmações e identifique a alternativa que apresenta uma consequência direta do aquecimento global com base em evidências científicas:",
                        image: "",
                        points: 10,
                        alternatives: [
                            { id: 'a', response: 'O derretimento das calotas polares e glaciares está causando a elevação do nível dos oceanos, ameaçando regiões costeiras e ilhas, além de alterar correntes oceânicas e padrões climáticos globais. Este processo também libera metano aprisionado no permafrost, potencializando ainda mais o efeito estufa', correct_alternative: true },
                            { id: 'b', response: 'O aquecimento global está causando um resfriamento generalizado dos oceanos, levando ao aumento das populações de peixes e à diminuição de eventos climáticos extremos em todas as regiões do planeta', correct_alternative: false },
                            { id: 'c', response: 'A elevação das temperaturas está promovendo o surgimento de novas áreas agriculturáveis em regiões polares, compensando completamente as perdas de produtividade em regiões tropicais', correct_alternative: false },
                            { id: 'd', response: 'O aumento da temperatura global está fortalecendo a camada de ozônio, protegendo a Terra da radiação ultravioleta e reduzindo a incidência de problemas de saúde relacionados à exposição solar', correct_alternative: false }
                        ]
                    }
                ];
                setQuestoes(questoesData);

                // Simular que o simulado foi concluído? Ajuste conforme necessário
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
        if (concluido || simulado?.visibility !== "published") return; // Bloquear alteração se concluído ou expirado
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

    const status = (() => {
        switch (simulado?.visibility) {
            case "draft":
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Concluído</span>;
            case "published":
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Em Andamento</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Expirada</span>;
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
                    <CardTitle className="text-2xl font-bold text-center text-gray-800">
                        {simulado?.title.toUpperCase()}
                    </CardTitle>
                    <div className="text-sm text-gray-700 font-semibold flex flex-col lg:flex-row md:flex-row md:justify-between lg:justify-between gap-2 align-center mt-4 ">
                        <p>Tentativas máximas: {simulado?.max_attempts}</p>
                        <p>Duração: {simulado?.duration_minutes} minutos</p>
                        <p>Status: {status}</p>
                    </div>
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
                                const showAnswerStyles = (concluido || simulado?.visibility !== "published");

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
                                        {simulado?.visibility === "published" ? (
                                            <input
                                                type="radio"
                                                id={`questao-${questao.id}-${alternativa.id}`}
                                                name={`questao-${questao.id}`}
                                                value={alternativa.id}
                                                checked={isSelected}
                                                onChange={() => handleRespostaChange(questao.id, alternativa.id)}
                                                className={`mt-1 h-4 w-4 accent-blue-600`}
                                                disabled={showAnswerStyles} // desabilita alteração
                                            />
                                        ) : (
                                            null
                                        )}
                                        <label htmlFor={`questao-${questao.id}-${alternativa.id}`} className="text-sm text-gray-800 leading-5 select-none">
                                            <strong>{alternativa.id.toUpperCase()})</strong> {alternativa.response}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Botão Finalizar só aparece se simulado estiver publicado e não concluído */}
            {(simulado?.visibility === "published" && !concluido) && (
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
        </div>
    );
}
