export type PurposeApiPayload = {
  purpose_name: string;
  purpose_code: string;
}
export type UpdatePurposeApiPayload = {
  purpose_name: string;
  purpose_code: string;
  id?:string | number;
}
export type PurposeMasterTablePageRowData = {
    id: string;
    hashed_key: string;
    purpose_name: string;
    purpose_code: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
}

export type DocumentsResponse = {
  data?: any[];
  [key: string]: any;
}