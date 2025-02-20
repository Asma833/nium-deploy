import { z } from "zod";

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?:
    | Array<{ value: string; label: string }>
    | { [key: string]: { label: string } };
  validation?: z.ZodType<any>;
  uppercase?: boolean;
}

export const basicDetails: Record<string, FormField> = {
  name: { name: "name", label: "Name", type: "text", required: true },
  typeOfOrganization: {
    name: "typeOfOrganization",
    label: "Type of Organization",
    type: "select",
    required: true,
    options: {
      partnership: { label: "Partnership" },
      proprietorship: { label: "Proprietorship" },
      privateLimited: { label: "Private Limited" },
      publicLimited: { label: "Public Limited" },
    },
  },
  agreementExpiryDate: {
    name: "agreementExpiryDate",
    label: "Agreement Expiry Date",
    type: "date",
    required: true,
  },
  pan: {
    name: "pan",
    label: "PAN",
    type: "text",
    required: true,
    uppercase: true,
    validation: z
      .string()
      .nonempty("PAN is required")
      .refine((val) => val === val.toUpperCase(), {
        message: "PAN must be uppercase",
      }),
  },
  gst: {
    name: "gst",
    label: "GST",
    type: "text",
    required: true,
    uppercase: true,
    validation: z
      .string()
      .nonempty("GST is required")
      .refine((val) => val === val.toUpperCase(), {
        message: "GST must be uppercase",
      }),
  },
  gstState: {
    name: "gstState",
    label: "GST State",
    type: "select",
    required: true,
    options: {
      maharashtra: { label: "Maharashtra" },
      gujarat: { label: "Gujarat" },
      karnataka: { label: "Karnataka" },
      delhi: { label: "Delhi" },
    },
  },
  agentCode: {
    name: "agentCode",
    label: "Agent Code",
    type: "text",
    required: true,
  },
  agentType: {
    name: "agentType",
    label: "Agent Type",
    type: "radio",
    required: true,
    options: {
      cashAndCarry: { label: "Cash & Carry" },
      largeEnterprise: { label: "Large Enterprise" },
    },
  },
};
export const agreementDetails = {
  bankDetails: {
    bankName: {
      name: "name",
      label: "Bank Name",
      type: "text",
      required: true,
    },
    accountNumber: {
      name: "accountNumber",
      label: "Account Number",
      type: "number",
      required: true,
    },
    accountHolderName: {
      name: "accountHolderName",
      label: "Account Holder Name",
      type: "text",
      required: true,
    },
    ifscCode: {
      name: "ifscCode",
      label: "IFSC Code",
      type: "text",
      required: true,
    },
    document: {
      name: "document",
      label: "Document",
      type: "select",
      required: true,
      options: {
        aadhar: { label: "Aadhar" },
        pan: { label: "PAN" },
        drivingLicense: { label: "Driving License" },
      },
    },
  },
  adminDetails: {
    name: { name: "name", label: "Name", type: "text", required: true },
    email: { name: "email", label: "Email", type: "email", required: true },
    mobileNo: {
      name: "mobileNo",
      label: "Mobile Number",
      type: "number",
      required: true,
    },
    product: {
      name: "product",
      label: "Configuration: Products",
      type: "checkbox",
      required: true,
      options: {
        card: { label: "Card", checked: true },
        currency: { label: "Currency", checked: false },
        remittance: { label: "Remittance", checked: false },
      },
    },
  },
};

export const commission = {
  commissionType: {
    name: "commissionType",
    label: "Commission Type",
    type: "radio",
    required: true,
    options: {
      fixed: { label: "Fixed" },
      variable: { label: "Variable" },
      hybrid: { label: "Hybrid" },
    },
  },
};
export const charges = {
  commissionType: {
    name: "charges",
    label: "Charges",
    type: "radio",
    required: true,
    options: {
      fixed: { label: "Fixed" },
      variable: { label: "Variable" },
      hybrid: { label: "Hybrid" },
    },
  },
};
export const adminDetails = {
  basicDetails: {
    hoBranchName: {
      name: "hoBranchName",
      label: "HO Branch Name",
      type: "text",
      required: true,
    },
    address: {
      name: "Address",
      label: "Address",
      type: "text",
      required: true,
    },
    status: {
      name: "status",
      label: "Status",
      type: "radio",
      required: true,
      options: {
        active: { label: "Active", checked: true },
        inactive: { label: "Inactive", checked: false },
      },
    },
  },
};

export const getFieldsByType = (type: string) => {
  return Object.values(basicDetails).filter((field) => field.type === type);
};

export const validationSchema = z.object(
  Object.values(basicDetails).reduce(
    (schema: { [key: string]: z.ZodType<any> }, field) => {
      if (field.validation) {
        schema[field.name] = field.validation;
      }
      return schema;
    },
    {}
  )
);
