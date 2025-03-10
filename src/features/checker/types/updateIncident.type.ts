export interface UpdateIncidentRequest {
    fields: {
      passportNumber: string;
      cardNumber: string;
      departureDate: string;
      incidentNumber: string;
      buySell: string;
      transactionType: string;
      eonInvoiceNumber: string;
      comment?: string;
      status: {
        approve: boolean;
        reject: boolean;
      };
    };
  }
  
  
  
  export interface UpdateIncidentResponse {
    success: boolean;
    message: string;
  }