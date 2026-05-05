'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (status !== 'authenticated' || !session) return;
    const accessToken = (session as any).accessToken;
    if (!accessToken) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Token ${accessToken}`
        }
      });

      if (!res.ok) throw new Error('Erro ao buscar usuários');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  const updateStatus = async (userId: number, newStatus: string) => {
    if (status !== 'authenticated' || !session) return { success: false };
    const accessToken = (session as any).accessToken;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${accessToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Erro ao atualizar status do usuário');
      
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
