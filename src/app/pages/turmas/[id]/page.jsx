'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { handleApiError, handleFetchError, handleUnexpectedError } from "@/utils/errorHandler";

export default function TurmaDetalhesPage() {
  const params = useParams();
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurmaDetalhes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dados de teste para a turma
        const turmaData = {
          id: params.id,
          name: "2TD",
          course: "Desenvolvimento de Sistemas",
          shift: "Afternoon",
          created_at: "2024-03-20T10:00:00.000Z",
          modified_at: "2024-03-20T10:00:00.000Z"
        };
        setTurma(turmaData);

        // Dados de teste para os alunos
        const alunosData = [
          {
            id: 1,
            name: "João Silva",
            registration: "2024001",
            email: "joao.silva@email.com",
            active: true
          },
          {
            id: 2,
            name: "Maria Santos",
            registration: "2024002",
            email: "maria.santos@email.com",
            active: true
          },
          {
            id: 3,
            name: "Pedro Oliveira",
            registration: "2024003",
            email: "pedro.oliveira@email.com",
            active: false
          },
          {
            id: 4,
            name: "Ana Costa",
            registration: "2024004",
            email: "ana.costa@email.com",
            active: true
          }
        ];
        setAlunos(alunosData);

        /* Comentando temporariamente as chamadas à API
        try {
          // Buscar detalhes da turma
          const turmaResponse = await fetch(`http://localhost:3001/admin/classes/${params.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          await handleApiError(turmaResponse, 'buscar detalhes da turma');
          const turmaData = await turmaResponse.json();
          setTurma(turmaData);

          // Buscar alunos da turma
          const alunosResponse = await fetch(`http://localhost:3001/admin/classes/${params.id}/students`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          await handleApiError(alunosResponse, 'buscar alunos da turma');
          const alunosData = await alunosResponse.json();
          setAlunos(alunosData);

        } catch (error) {
          handleFetchError(error, 'buscar dados da turma');
        }
        */

      } catch (error) {
        handleUnexpectedError(error, 'carregar página de turma');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTurmaDetalhes();
    }
  }, [params.id]);

  const filteredAlunos = alunos.filter((aluno) => {
    return aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           aluno.registration.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/pages/turmas" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Turmas
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{turma?.name}</CardTitle>
          <div className="text-sm text-gray-500">
            <p>Curso: {turma?.course}</p>
            <p>Turno: {turma?.shift === 'Afternoon' ? 'Tarde' : 'Manhã'}</p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Alunos da Turma</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.name}</TableCell>
                  <TableCell>{aluno.registration}</TableCell>
                  <TableCell>{aluno.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        aluno.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {aluno.active ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 