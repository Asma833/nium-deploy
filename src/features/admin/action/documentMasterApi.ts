import { API } from "@/core/constant/apis";
import axiosInstance from "@/core/services/axios/axiosInstance";
import { DocumentApiPayload, DocumentMappingPaylod } from "../types/document.type";

export const documentMasterApi =  {
  documentMasterCreation: async (documentData: DocumentApiPayload): Promise<DocumentApiPayload> => {
    const { data } = await axiosInstance.post<DocumentApiPayload>(API.DOCUMENT_MASTER.CREATE_DOCUMENT, documentData);
    return data;
  },
  updateDocument: async (documentId: string, documentData: DocumentApiPayload): Promise<DocumentApiPayload> => {
    const { data } = await axiosInstance.put<DocumentApiPayload>(API.DOCUMENT_MASTER.UPDATE_DOCUMENT + `/${documentId}`, documentData);
    return data;
  },
  deleteDocument: (documentId: string) => {
    return axiosInstance.delete(API.DOCUMENT_MASTER.DELETE_DOCUMENT(documentId), {
      headers: {
        accept: '*/*',
      },
    });
  },
  documentTransactionPurposeMapping: async (documentData: DocumentMappingPaylod): Promise<DocumentMappingPaylod> => {
    const { data } = await axiosInstance.post<DocumentMappingPaylod>(API.DOCUMENT_MASTER.DOC_PURPOSE_TRANS_MAPPING, documentData);
    return data;
  },

};