



enum FieldType {
    Text = "text",
    Email = "email",
    Password = "password",
    Checkbox = "checkbox"
  }
  
interface FormField {
    label: string;
    type: FieldType;
    required: boolean;
    placeholder: string;
  }
interface CheckboxField extends FormField {
    type: FieldType.Checkbox;
    options: Record<string, { label: string }>;
  }
type Field = FormField | CheckboxField;

type Fields = {
  passportNumber: Field;
  cardNumber: Field;
  departureDate: Field;
  incidentNumber: Field;
  buySell: Field;
  transactionType: Field;
  eonInvoiceNumber: Field;
  comment: Field;
  status: CheckboxField;
};

interface formConfig {
  sectionTitle: string;
  fields: Fields;
  tableData: { currency: string; rate: number; amount: number; }[];
}

export const updateFormIncidentConfig:formConfig = {
sectionTitle: "Transaction Form",
  fields: {
    passportNumber: {
      label: "Passport Number",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter Passport Number",
    },
    
    departureDate: {
      label: "Departure Date",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter Departure Date",
    },
    
    buySell: {
      label: "Buy/Sell",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter Buy/Sell",
    },
    cardNumber: {
      label: "Card No.",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter Card Number",
    },
    incidentNumber: {
      label: "Incident Number",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter Incident Number",
    },
    transactionType: {
      label: "Transaction Type",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter Transaction Type",
    },
    
    
    status: {
      label: "Status",
      type: FieldType.Checkbox,
      required: true,
      placeholder: "",
      options: {
        approve: { label: "Approve" },
        reject: { label: "Reject" }
      }
    },
    eonInvoiceNumber: {
      label: "EON Invoice Number",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter EON Invoice Number",
    },
    comment: {
      label: "Comment",
      type: FieldType.Text,
      required: false,
      placeholder: "Enter Comment",
    },
  },
  tableData: [
    { currency: "USD/INR", rate: 87.84, amount: 500 },
    { currency: "EUR/INR", rate: 95.50, amount: 300 },
  ]
};



