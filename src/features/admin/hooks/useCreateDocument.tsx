import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DocumentApiPayload } from '../types/document.type';
import { documentMasterApi } from '../action/documentMasterApi';

export const useCreateDocument = ({
  onDocumentCreateSuccess,
}: {
  onDocumentCreateSuccess: (data: DocumentApiPayload) => void;
}) => {
  const mapFormDataToApiPayload = async (formData: DocumentApiPayload): Promise<DocumentApiPayload> => {
    return {
      name: formData.name,
      type: 'identity',
      code: formData.code,
      display_name: formData.display_name,
      fields_required: {
        number: 'required',
        dob: 'optional',
      },
      description: formData.description,
    };
  };

  const { mutate, isPending, error } = useMutation<DocumentApiPayload, Error, DocumentApiPayload>({
    mutationFn: async (documentData: DocumentApiPayload) => {
      const apiPayload = await mapFormDataToApiPayload(documentData);
      await documentMasterApi.documentMasterCreation(apiPayload);
      return apiPayload;
    },
    onSuccess: (data: DocumentApiPayload) => {
      toast.success('Document created successfully');
      onDocumentCreateSuccess(data);
    },
    onError: (error: Error) => {
      if (error && typeof (error as any).status === 'number' && (error as any).status === 409) {
        toast.error('Document with the same code already exists');
      } else {
        toast.error(error.message || 'Document creation failed');
      }
    },
  });

  return { mutate, isLoading: isPending, error };
};
