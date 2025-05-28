
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function Results() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Resultados Recentes</h2>
                <Button variant="outline" className="gap-2">
                    Ver todos os resultados
                </Button>
            </div>
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="font-semibold">Simulado</TableHead>
                                <TableHead className="font-semibold">Data</TableHead>
                                <TableHead className="font-semibold">Nota</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">Simulado de Química</TableCell>
                                <TableCell>27/05/2025</TableCell>
                                <TableCell className="font-semibold text-green-600">85%</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="w-20 bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1"
                                    >
                                        Aprovado
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">Simulado de Física</TableCell>
                                <TableCell>17/06/2025</TableCell>
                                <TableCell className="font-semibold text-green-600">72%</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="w-20 bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1"
                                    >
                                        Aprovado
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">Simulado de Português</TableCell>
                                <TableCell>08/07/2025</TableCell>
                                <TableCell className="font-semibold text-yellow-600">68%</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="w-20 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1"
                                    >
                                        Revisão
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}