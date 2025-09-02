export type DocumentApiPayload = {
  name: string;
  type?: string;
  code: string;
  id?: string;
  display_name: string;
  fields_required?: {
    number: string;
    dob: string;
  };
  description: string;
};
export type DeletableItem = {
  mappingId: string;
};

export type DocumentMappingPaylod = {
  transaction_purpose_map_id: string;
  document_id: string;
  isBackRequired: boolean;
  is_mandatory: boolean;
}[];
export type UpdateDocumentMappingPaylod = {
  transaction_purpose_map_id: string;
  document_id: string;
  isBackRequired: boolean;
  is_mandatory: boolean;
};
