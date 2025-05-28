import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { updateIncidentApi } from '../api/updateIncidentApi';
import { UpdateGetRequestData } from '../types/updateIncident.types';

export const useGetUpdateIncident = (incidentData: UpdateGetRequestData) => {
  const query = useQuery({
    queryKey: ['updateIncident'],
    queryFn: async () => {
      try {
        const response =
          await updateIncidentApi.getUpdateIncident(incidentData);
        if (!response) {
          throw new Error('Invalid API response');
        }
        return response;
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch incident data');
        throw error;
      }
    },
    enabled: !!incidentData,
  });

  return { ...query, fetchData: query.refetch };
};
