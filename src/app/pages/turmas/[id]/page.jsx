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
  const [professores, setProfessores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTurmaDetalhes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const turmaResponse = await fetch(`http://localhost:3000/admin/classes/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Resposta da turma:', turmaResponse.json);
        const turmaData = await turmaResponse.json();
        console.log('Dados da turma:', turmaData);

        await handleApiError(turmaResponse, 'buscar detalhes da turma');
      
        setTurma(turmaData);
        setAlunos(turmaData.students || []);
        setProfessores(turmaData.teachers || []);

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
      aluno.enrollment.toLowerCase().includes(searchTerm.toLowerCase());
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

  const SHIFT_OPTIONS = [
    { value: 'Morning', label: 'Manhã' },
    { value: 'Afternoon', label: 'Tarde' },
    { value: 'Evening', label: 'Noturno' },
  ];

  const getShiftLabel = (shiftValue) => {
    const shift = SHIFT_OPTIONS.find(option => option.value === shiftValue);
    return shift ? shift.label : shiftValue;
  };

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
            <p>Turno: {getShiftLabel(turma?.shift)}</p>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Professores da Turma</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader> 
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Disciplina</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professores.map((professor) => (
                <TableRow key={professor.teacher_id}>
                  <TableCell>{professor.teacher_name}</TableCell>
                  <TableCell>{professor.teacher_email}</TableCell>
                  <TableCell>
                    {professor.subjects?.map((subject, index) => (
                      <span key={subject.id}>
                        {subject.name}
                        {index < professor.subjects.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.map((aluno) => (
                <TableRow key={aluno.student_id}>
                  <TableCell>{aluno.name}</TableCell>
                  <TableCell>{aluno.enrollment}</TableCell>
                  <TableCell>{aluno.email}</TableCell>
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