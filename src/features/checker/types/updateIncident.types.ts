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

export enum IncidentPageId {
  UPDATE = 'updateIncident',
  VIEW_ALL = 'viewAllIncident',
  ASSIGN = 'assignIncident',
  COMPLETED = 'completedIncident',
}

export enum IncidentMode {
  EDIT = 'edit',
  VIEW = 'view',
  EDIT_INVOICE = 'editInvoice',
}

export type UpdateIncidentDialogProps = {
  mode: IncidentMode;
  pageId: IncidentPageId;
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

export type EsignFileDetails = {
  file_name?: string;
  esign_file?: string;
  esign_fields?: {
    esign_fields?: any;
  };
  esign_allow_fill?: boolean;
  esign_profile_id?: string;
  esign_additional_files?: any[];
};

export type EsignDetails = {
  status?: string;
  esign_doc_id?: string;
  esign_details?: Array<{
    esign_url?: string | null;
    url_status?: boolean;
    esign_expiry?: string | null;
    esigner_name?: string | null;
    esigner_email?: string | null;
    esigner_phone?: string | null;
  }>;
  esigner_details?: any;
};

export type EsignRecord = {
  id?: string;
  hashed_key?: string;
  partner_order_id?: string;
  order_id?: string;
  attempt_number?: number;
  task_id?: string;
  group_id?: string;
  esign_file_details?: EsignFileDetails;
  esign_stamp_details?: {
    esign_stamp_value?: string;
    esign_series_group?: string;
    esign_stamp_series?: string;
  };
  esign_invitees?: Array<{
    esigner_name?: string;
    esigner_email?: string;
    esigner_phone?: string;
    aadhaar_esign_verification?: {
      aadhaar_yob?: string;
      aadhaar_gender?: string;
      aadhaar_pincode?: string;
    };
  }>;
  esign_details?: EsignDetails;
  esign_doc_id?: string | null;
  status?: string;
  request_id?: string;
  completed_at?: string;
  esign_expiry?: string | null;
  active?: boolean;
  expired?: boolean;
  rejected?: boolean;
  result?: any;
  esigners?: any;
  file_details?: any;
  request_details?: any;
  esign_irn?: string | null;
  esign_folder?: string | null;
  esign_type?: string | null;
  esign_url?: string | null;
  esigner_email?: string | null;
  esigner_phone?: string | null;
  is_signed?: boolean;
  type?: string | null;
  created_by?: string;
  updated_by?: string;
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
  order_status?: string | null | boolean;
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
  v_kyc_completed_by_customer?: boolean | null;
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
  is_video_kyc_link_regenerated_details?: any[];
  created_by?: string;
  updated_by?: string;
  checker_id?: string | null;
  merged_document?: MergedDocument;
  created_at?: string;
  transaction_type_name?: {
    id: string;
    name: string;
  } | null;
  purpose_type_name?: {
    id: string;
    purpose_name: string;
  };
  esigns?: EsignRecord[];
  vkycs?: any[];
  resources_documents_files?: {
    [key: string]: string;
  };
  resources_images_files?: {
    [key: string]: string;
  };
  resources_videos_files?: {
    [key: string]: string;
  };
  orders?: Order[];
  totalOrders?: number;
};

export type CheckerOrdersResponse = {
  message?: string;
  order?: Order;
};

export type OrderRowData = {
  rowData: Order;
};

export type Orders = {
  [key: string]: Order;
};

export enum TransactionTypeEnum {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export type TransactionType =
  | TransactionTypeEnum.ALL
  | TransactionTypeEnum.COMPLETED
  | TransactionTypeEnum.PENDING
  | TransactionTypeEnum.REJECTED;

export type NiumOrderIDProps = {
  rowData: any;
  openModal?: (value: string) => void;
  className?: string;
};
