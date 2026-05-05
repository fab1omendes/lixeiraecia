"use client"

import { useUsersAdmin } from "@/hooks/use-users-admin";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  UserCog, 
  Mail, 
  Phone, 
  Calendar,
  ShieldCheck,
  Users
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsuariosPainel() {
  const { users, loading, error, updateStatus } = useUsersAdmin();

  if (loading && users.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleToggleStatus = (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'A' ? 'I' : 'A';
    updateStatus(userId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-outfit">Gestão de Usuários</h1>
          <p className="text-gray-500 mt-2 text-sm lg:text-base">Gerencie as contas e permissões dos clientes.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">{users.length} usuários no total</span>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 px-6 py-4">
          <CardTitle className="text-lg font-outfit text-gray-800 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-blue-500" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error && <p className="p-6 text-red-500 text-sm">{error}</p>}
          
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 px-6">Usuário</TableHead>
                <TableHead className="font-semibold text-gray-700">Contato</TableHead>
                <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Cadastro</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 px-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 truncate">{user.name}</span>
                          {user.is_staff && (
                            <Badge className="bg-blue-600 text-[10px] h-4 px-1 shadow-none">STAFF</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1 italic">
                        <Phone className="w-3 h-3" />
                        {user.phone || "Não informado"}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {user.cpf || "Sem CPF"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gray-200 text-gray-600 font-medium">
                      {user.user_type === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.status === 'A' 
                      ? "bg-green-100 text-green-700 border-none shadow-none" 
                      : "bg-gray-100 text-gray-600 border-none shadow-none"
                    }>
                      {user.status === 'A' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.date_joined).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <UserCog className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Ações do Usuário</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.status)}>
                          {user.status === 'A' ? 'Desativar Usuário' : 'Ativar Usuário'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Redefinir Senha
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
