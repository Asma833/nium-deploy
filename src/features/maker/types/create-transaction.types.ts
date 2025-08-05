export type CreateTransactionRequest = {
  partner_order_id: string;
  transaction_type_id: string;
  is_e_sign_required: boolean;
  is_v_kyc_required: boolean;
  purpose_type_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_pan: string;
  paid_by: string;
};

export type TransactionCreatedDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  createdTransactionId: string;
  niumForexOrderId: string;
  isSubmitting?: boolean;
};
