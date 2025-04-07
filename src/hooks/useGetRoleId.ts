import axiosInstance from '@/core/services/axios/axiosInstance';
import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/utils/getUserFromRedux';

interface Role {
  id: string;
  hashed_key: string;
  name: string;
  status: boolean;
  created_by: string | null;
  updated_by: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * A hook that provides a function to get role IDs by name
 * @returns A function that accepts a role name and returns the corresponding ID
 */
export const useGetRoleId = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { getUserHashedKey } = useCurrentUser();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/roles');
        setRoles(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch roles')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Function to get role ID by name
  const getRoleId = (roleName: string): string | undefined => {
    const role = roles.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    return role?.id;
  };

  // Function to get hashed role key by name
  const getHashedRoleId = (roleName: string): string | undefined => {
    const role = roles.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    return role?.hashed_key;
  };

  // Function to get the logged-in user's hashed key
  const getCurrentUserHashedKey = (): string | undefined => {
    return getUserHashedKey();
  };

  return {
    getRoleId,
    getHashedRoleId,
    getCurrentUserHashedKey,
    roles,
    loading,
    error,
  };
};

export default useGetRoleId;
