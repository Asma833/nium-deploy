import { API } from '@/core/constant/apis';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { DocumentApiPayload, DocumentMappingPaylod, UpdateDocumentMappingPaylod } from '../types/document.type';

export const documentMasterApi = {
  documentMasterCreation: async (documentData: DocumentApiPayload): Promise<DocumentApiPayload> => {
    const { data } = await axiosInstance.post<DocumentApiPayload>(API.DOCUMENT_MASTER.CREATE_DOCUMENT, documentData);
    return data;
  },
  updateDocument: async (documentId: string, documentData: DocumentApiPayload): Promise<DocumentApiPayload> => {
    const { data } = await axiosInstance.put<DocumentApiPayload>(
      API.DOCUMENT_MASTER.UPDATE_DOCUMENT + `/${documentId}`,
      documentData
    );
    return data;
  },
  updateDocumentMapping: async (
    document: { mappingId: string },
    documentData: UpdateDocumentMappingPaylod
  ): Promise<UpdateDocumentMappingPaylod> => {
    const { data } = await axiosInstance.put<UpdateDocumentMappingPaylod>(
      API.DOCUMENT_MASTER.UPDATE_MAPPING_DOCUMENT + `/${document?.mappingId}`,
      documentData
    );
    return data;
  },
  deleteDocument: async (documentId: string) => {
    return await axiosInstance.delete(API.DOCUMENT_MASTER.DELETE_DOCUMENT(documentId));
  },
  deleteDocumentMapping: async (documentId: string) => {
    return await axiosInstance.delete(API.DOCUMENT_MASTER.DELETE_MAPPING_DOCUMENT(documentId));
  },
  documentTransactionPurposeMapping: async (documentData: DocumentMappingPaylod): Promise<DocumentMappingPaylod> => {
    const { data } = await axiosInstance.post<DocumentMappingPaylod>(
      API.DOCUMENT_MASTER.DOC_PURPOSE_TRANS_MAPPING,
      documentData
    );
    return data;
  },
};
