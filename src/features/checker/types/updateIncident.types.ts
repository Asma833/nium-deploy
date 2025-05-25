export type UpdateIncidentRequest = {
  fields: {
    // Original fields
    passportNumber?: string;
    cardNumber?: string;
    departureDate?: string;
    incidentNumber?: string;
    buySell?: string;
    transactionType?: string;
    eonInvoiceNumber?: string;
    comment?: string;
    status?: {
      approve?: boolean;
      reject?: boolean;
    };

    // New fields based on the form we're using
    niumId?: string;
    customerPan?: string;
    customerName?: string;
    bmfOrderRef?: string;
    purpose?: string;
    niumInvoiceNumber?: string;
  };
};

export type UpdateIncidentSelectedRowData = Order & {
  incident_number?: string;
  eon_invoice_number?: string;
  transaction_mode?: string;
  status?: {
    approve: boolean;
    reject: boolean;
  };
};

export type UpdateIncidentDialogProps = {
  mode: 'edit' | 'view';
  pageId:
    | 'updateIncident'
    | 'viewAllIncident'
    | 'assignIncident'
    | 'completedIncident';
  selectedRowData: UpdateIncidentSelectedRowData;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export type ExchangeRateTable = {
  currency: string;
  rate: number;
  amount: number;
};

export type UpdateIncidentFormData = {
  formActionRight: string;
  mode?: string;
  pageId?: string;
  rowData?: Order & {
    incident_number?: string;
    eon_invoice_number?: string;
    transaction_mode?: string;
    status?: {
      approve: boolean;
      reject: boolean;
    };
  };
  setIsModalOpen: (isOpen: boolean) => void;
};

export type UpdateIncidentResponse = {
  success: boolean;
  message: string;
};

export type UpdateGetRequestData = {
  checkerId: string;
  transaction_type: string;
};

export type EsignLinkRequest = {
  partner_order_id: string;
};

export type MergedDocument = {
  url?: string;
  size?: number;
  mimeType?: string;
  created_at?: string;
  documentIds?: string[];
};

export type Order = {
  id?: string;
  hashed_key?: string;
  partner_id?: string;
  partner_order_id?: string;
  transaction_type?: string | null;
  purpose_type?: string;
  is_esign_required?: boolean;
  is_v_kyc_required?: boolean;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_pan?: string;
  order_status?: string;
  e_sign_status?: string;
  e_sign_link?: string | null;
  e_sign_link_status?: string | null;
  e_sign_link_doc_id?: string | null;
  e_sign_link_request_id?: string | null;
  e_sign_link_expires?: string | null;
  e_sign_completed_by_customer?: string | null;
  e_sign_customer_completion_date?: string | null;
  e_sign_doc_comments?: string | null;
  v_kyc_reference_id?: string | null;
  v_kyc_profile_id?: string | null;
  v_kyc_status?: string;
  v_kyc_link?: string | null;
  v_kyc_link_status?: string | null;
  v_kyc_link_expires?: string | null;
  v_kyc_completed_by_customer?: string | null;
  v_kyc_customer_completion_date?: string | null;
  v_kyc_comments?: string | null;
  incident_status?: string | null;
  incident_checker_comments?: string | null;
  nium_order_id?: string;
  nium_invoice_number?: string | null;
  date_of_departure?: string | null;
  incident_completion_date?: string | null;
  is_esign_regenerated?: boolean;
  is_esign_regenerated_details?: string | null;
  is_video_kyc_link_regenerated?: boolean;
  is_video_kyc_link_regenerated_details?: string | null;
  created_by?: string;
  updated_by?: string;
  checker_id?: string | null;
  merged_document?: MergedDocument;
  transaction_type_name?: {
    id: string;
    name: string;
  };
  purpose_type_name?: {
    id: string;
    purpose_name: string;
  };
};

export type Orders = {
  [key: string]: Order;
};
