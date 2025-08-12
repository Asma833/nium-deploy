import { useMutation } from "@tanstack/react-query";
import { documentMasterApi } from "../action/documentMasterApi";
import { toast } from "sonner";

export const useUpdateMapDocument = ({ onDocumentUpdateSuccess }: { onDocumentUpdateSuccess: () => void }) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        name: data?.name,
        code: data?.code,
        display_name: data?.display_name,
        description: data?.description,
      };
      return await documentMasterApi.updateDocument(id, payload);
    },
    onSuccess: () => {
      const successMessage = 'Document updated successfully';
      toast.success(successMessage);
      onDocumentUpdateSuccess();
    },
    onError: (error: Error) => {
      console.error('Update error:', error);
      const errorMessage = error.message || 'Document update failed';
      toast.error(errorMessage);
    },
  });

  return { mutate, isLoading: isPending, error };
};