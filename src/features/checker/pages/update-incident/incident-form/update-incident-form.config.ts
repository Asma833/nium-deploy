import { FieldType } from '@/types/enums';

export const sectionTitle = 'Transaction Form';

export const updateFormIncidentConfig = {
  basicDetails: {
    cardNo: {
      label: 'Card No.',
      name: 'cardNo',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Card Number',
    },
    niumId: {
      label: 'Nium Id',
      name: 'nium_order_id',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Nium ID',
    },

    customerPan: {
      label: 'Customer PAN',
      name: 'customer_pan',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Customer PAN',
    },
    customerName: {
      label: 'Customer Name',
      name: 'customer_name',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Customer Name',
    },
    bmfOrderRef: {
      label: 'BMF Order Ref',
      name: 'partner_order_id',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter BMF Order Ref',
    },
    transactionType: {
      label: 'Transaction Type',
      name: 'transaction_type',
      type: FieldType.Text,
      placeholder: 'Enter Transaction Type',
    },
    purpose: {
      label: 'Purpose Type',
      name: 'purpose_type',
      type: FieldType.Text,
      placeholder: 'Enter Purpose',
    },
  },
  buySellType: {
    buySell: {
      label: 'Buy/Sell',
      name: 'incidentform.buySell',
      type: FieldType.Text,
      placeholder: 'Enter Buy/Sell',
    },
  },
  approveReject: {
    status: {
      label: 'Status',
      name: 'incidentform.status',
      type: FieldType.Checkbox,
      required: true,
      placeholder: '',
      options: {
        approve: { label: 'Approve', checked: true },
        reject: { label: 'Reject', checked: false },
      },
    },
  },
  checkFeedInput: {
    comment: {
      label: 'Comment',
      name: 'fields.comment',
      type: FieldType.TextArea,
      placeholder: 'Enter Comment',
    },
    niumInvoiceNo: {
      label: 'Nium Invoice No',
      name: 'fields.niumInvoiceNumber',
      type: FieldType.Text,
      placeholder: 'Enter Nium Invoice No',
    },
  },
};
