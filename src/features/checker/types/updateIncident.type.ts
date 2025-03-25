export interface UpdateIncidentRequest {
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
  }
}

export interface UpdateIncidentResponse {
  success: boolean;
  message: string;
}
export interface UpdateGetRequestData {
  checkerId: string;
  transaction_type: string;
}
export interface EsignLinkRequest {
  partner_order_id:string;
}