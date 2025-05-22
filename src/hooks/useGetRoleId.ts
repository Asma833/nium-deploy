import axiosInstance from '@/core/services/axios/axiosInstance';
import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { API } from '@/core/constant/apis';

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

let cachedRoles: Role[] | null = null;  // <-- corrected initialization
let cachedPromise: Promise<Role[]> | null = null;

export const useGetRoleId = () => {
  const [roles, setRoles] = useState<Role[]>(cachedRoles || []);
  const [loading, setLoading] = useState<boolean>(cachedRoles === null);
  const [error, setError] = useState<Error | null>(null);
  const { getUserHashedKey } = useCurrentUser();

  useEffect(() => {
    if (cachedRoles !== null) {
      setRoles(cachedRoles);
      setLoading(false);
      return;
    }

    if (!cachedPromise) {
      cachedPromise = axiosInstance
        .get(API.USER.GET_ROLES)
        .then((response) => {
          cachedRoles = Array.isArray(response.data) ? response.data : [];
          return cachedRoles;
        })
        .catch((err) => {
          cachedRoles = [];
          throw err;
        });
    }

    cachedPromise!
      .then((rolesData) => setRoles(rolesData))
      .catch((err) => setError(err instanceof Error ? err : new Error('Failed to fetch roles')))
      .finally(() => setLoading(false));
  }, []);

  const getRoleId = (roleName: string): string | undefined => {
    const role = roles.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    return role?.id;
  };

  const getHashedRoleId = (roleName: string): string | undefined => {
    const role = roles.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );
    return role?.hashed_key;
  };

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
