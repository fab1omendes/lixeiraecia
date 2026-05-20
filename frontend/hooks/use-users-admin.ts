'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUsersAdmin, updateUserStatusAction } from '@/lib/api/admin';

export interface UserAdmin {
  id: number;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  user_type: string;
  status: string;
  date_joined: string;
  is_staff: boolean;
}

export function useUsersAdmin() {
  const { status } = useSession();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    try {
      const data = await getUsersAdmin();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const updateStatus = async (userId: number, newStatus: string) => {
    if (status !== 'authenticated') return { success: false };

    try {
      const res = await updateUserStatusAction(userId, newStatus);
      if (!res.success) throw new Error(res.error || 'Erro ao atualizar status do usuário');
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, fetchUsers]);

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    updateStatus
  };
}
