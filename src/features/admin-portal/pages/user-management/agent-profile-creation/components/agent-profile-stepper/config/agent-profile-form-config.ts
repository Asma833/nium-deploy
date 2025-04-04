import { z } from 'zod';

// Utility function to generate unique field names
const generateFieldName = (section: string, field: string) =>
  `${section}.${field}`;

interface FormField {
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  options?:
    | Array<{ value: string; label: string }>
    | { [key: string]: { label?: string; checked?: boolean } };
  validation?: z.ZodType<any>;
  uppercase?: boolean;
  defaultValue?: any;
}

export const defaultFormValues = {
  basicDetails: {
    name: '',
    typeOfOrganization: '',
    agreementExpiryDate: null,
    dateOfBirth: null,
    pan: '',
    gst: '',
    gstState: '',
    agentCode: '',
    agentType: 'cashAndCarry',
  },
  agreementDetails: {
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      ifscCode: '',
      document: '',
      agreementDate: null,
    },
    adminDetails: {
      name: '',
      email: '',
      mobileNo: '',
      product: ['card'],
    },
  },
  commission: {
    commissionType: '',
  },
  charges: {
    commissionType: '',
  },
  adminDetails: {
    basicDetails: {
      hoBranchName: '',
      address: '',
      status: 'active',
    },
    agentAdminDetails: {
      name: '',
      email: '',
      branch: '',
      role: '',
      status: 'active',
      configurationStatus: 'active',
    },
  },
};

export const basicDetails: Record<string, FormField> = {
  name: {
    name: 'basicDetails.name',
    label: 'Name',
    type: 'text',
    required: true,
    defaultValue: '',
  },
  typeOfOrganization: {
    name: 'basicDetails.typeOfOrganization',
    label: 'Type of Organization',
    type: 'select',
    required: true,
    defaultValue: '',
    options: {
      partnership: { label: 'Partnership' },
      proprietorship: { label: 'Proprietorship' },
      privateLimited: { label: 'Private Limited' },
      publicLimited: { label: 'Public Limited' },
    },
  },
  agreementExpiryDate: {
    name: 'basicDetails.agreementExpiryDate',
    label: 'Agreement Expiry Date',
    type: 'date',
    required: true,
  },
  dateOfBirth: {
    name: 'basicDetails.dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    required: true,
    defaultValue: '',
  },
  pan: {
    name: 'basicDetails.pan',
    label: 'PAN',
    type: 'text',
    required: true,
    uppercase: true,
    validation: z
      .string()
      .nonempty('PAN is required')
      .refine((val) => val === val.toUpperCase(), {
        message: 'PAN must be uppercase',
      }),
  },
  gst: {
    name: 'basicDetails.gst',
    label: 'GST',
    type: 'text',
    required: true,
    uppercase: true,
    validation: z
      .string()
      .nonempty('GST is required')
      .refine((val) => val === val.toUpperCase(), {
        message: 'GST must be uppercase',
      }),
  },
  gstState: {
    name: 'basicDetails.gstState',
    label: 'GST State',
    type: 'select',
    required: true,
    defaultValue: '',
    options: {
      maharashtra: { label: 'Maharashtra' },
      gujarat: { label: 'Gujarat' },
      karnataka: { label: 'Karnataka' },
      delhi: { label: 'Delhi' },
    },
  },
  agentCode: {
    name: 'basicDetails.agentCode',
    label: 'Agent Code',
    type: 'text',
    required: true,
  },
  agentType: {
    name: 'basicDetails.agentType',
    label: 'Agent Type',
    type: 'radio',
    required: false,
    options: {
      cashAndCarry: { label: 'Cash & Carry', checked: true },
      largeEnterprise: { label: 'Large Enterprise', checked: false },
    },
  },
};

export const agreementDetails = {
  bankDetails: {
    bankName: {
      name: 'agreementDetails.bankDetails.bankName',
      label: 'Bank Name',
      type: 'text',
      required: true,
      defaultValue: '',
    },
    accountNumber: {
      name: 'agreementDetails.bankDetails.accountNumber',
      label: 'Account Number',
      type: 'number',
      required: true,
    },
    accountHolderName: {
      name: 'agreementDetails.bankDetails.accountHolderName',
      label: 'Account Holder Name',
      type: 'text',
      required: true,
    },
    ifscCode: {
      name: 'agreementDetails.bankDetails.ifscCode',
      label: 'IFSC Code',
      type: 'text',
      required: true,
    },
    document: {
      name: 'agreementDetails.bankDetails.document',
      label: 'Document',
      type: 'select',
      required: true,
      defaultValue: '',
      options: {
        aadhar: { label: 'Aadhar' },
        pan: { label: 'PAN' },
        drivingLicense: { label: 'Driving License' },
      },
    },
    agreementDate: {
      name: 'agreementDetails.bankDetails.agreementDate',
      label: 'Agreement Date',
      type: 'date',
      defaultValue: '',
    },
  },
  adminDetails: {
    name: {
      name: 'agreementDetails.adminDetails.name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    email: {
      name: 'agreementDetails.adminDetails.email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    mobileNo: {
      name: 'agreementDetails.adminDetails.mobileNo',
      label: 'Mobile Number',
      type: 'number',
      required: true,
    },
    product: {
      name: 'agreementDetails.adminDetails.product',
      label: 'Configuration: Products',
      type: 'checkbox',
      required: true,
      options: {
        card: { label: 'Card', checked: true },
        currency: { label: 'Currency', checked: false },
        remittance: { label: 'Remittance', checked: false },
      },
    },
  },
};

export const commission = {
  commissionType: {
    name: generateFieldName('commission', 'commissionType'),
    label: 'Commission Type',
    type: 'radio',
    required: true,
    options: {
      fixed: { label: 'Fixed' },
      variable: { label: 'Variable' },
      hybrid: { label: 'Hybrid' },
    },
  },
};

export const charges = {
  commissionType: {
    name: generateFieldName('charges', 'commissionType'),
    label: 'Charges',
    type: 'radio',
    required: true,
    options: {
      fixed: { label: 'Fixed' },
      variable: { label: 'Variable' },
      hybrid: { label: 'Hybrid' },
    },
  },
};

export const adminDetails = {
  basicDetails: {
    hoBranchName: {
      name: generateFieldName('adminDetails.basicDetails', 'hoBranchName'),
      label: 'HO Branch Name',
      type: 'text',
      required: true,
    },
    address: {
      name: generateFieldName('adminDetails.basicDetails', 'address'),
      label: 'Address',
      type: 'text',
      required: true,
    },
    status: {
      name: generateFieldName('adminDetails.basicDetails', 'status'),
      label: 'Status',
      type: 'radio',
      required: true,
      options: {
        active: { label: 'Active', checked: true },
        inactive: { label: 'Inactive', checked: false },
      },
    },
  },
  agentAdminDetails: {
    name: {
      name: generateFieldName('adminDetails.agentAdminDetails', 'name'),
      label: 'Name',
      type: 'text',
      required: true,
    },
    email: {
      name: generateFieldName('adminDetails.agentAdminDetails', 'email'),
      label: 'Email',
      type: 'email',
      required: true,
    },
    branch: {
      name: generateFieldName('adminDetails.agentAdminDetails', 'branch'),
      label: 'Branch',
      type: 'text',
      required: true,
    },
    role: {
      name: generateFieldName('adminDetails.agentAdminDetails', 'role'),
      label: 'Role',
      type: 'select',
      required: true,
      options: {
        admin: { label: 'Admin' },
        user: { label: 'User' },
      },
    },
    status: {
      name: generateFieldName('adminDetails.agentAdminDetails', 'status'),
      label: 'Status',
      type: 'radio',
      required: true,
      options: {
        active: { label: 'Active', checked: true },
        inactive: { label: 'Inactive', checked: false },
      },
    },
    configurationStatus: {
      name: generateFieldName(
        'adminDetails.agentAdminDetails',
        'configurationStatus'
      ),
      label: 'Configuration Status',
      type: 'radio',
      required: true,
      options: {
        active: { label: 'Active', checked: true },
        inactive: { label: 'Inactive', checked: false },
      },
    },
  },
};

export const getFieldsByType = (type: string) => {
  return Object.values(basicDetails).filter((field) => field.type === type);
};

export const validationSchema = z
  .object({
    basicDetails: z.object({
      name: z.string().min(1, 'Name is required'),
      typeOfOrganization: z.string().min(1, 'required'),
      agreementExpiryDate: z.date().optional(),
      dateOfBirth: z.date().optional(),
      pan: z.string(),
      gst: z.string(),
      gstState: z.string(),
      agentCode: z.string(),
      agentType: z.string().min(1, 'required'),
    }),
    agreementDetails: z.object({
      bankDetails: z.object({
        // ...validation rules
      }),
      adminDetails: z.object({
        // ...validation rules
      }),
    }),
    // ...other validation rules
  })
  .partial();
