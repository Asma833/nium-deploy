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
  firstName: Field;
  lastName: Field;
  email: Field;
  password: Field;
  confirmPassword: Field;
  productType: CheckboxField;
};

interface UserFormConfig {
  sectionTitle: string;
  fields: Fields;
}

export const userFormConfig: UserFormConfig = {
  sectionTitle: "Create User",
  fields: {
    firstName: {
      label: "First Name",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter First Name",
    },
    lastName: {
      label: "Last Name",
      type: FieldType.Text,
      required: true,
      placeholder: "Enter Last Name",
    },
    email: {
      label: "Email",
      type: FieldType.Email,
      required: true,
      placeholder: "Enter Email",
    },
    password: {
      label: "Password",
      type: FieldType.Password,
      required: true,
      placeholder: "Enter Password",
    },
    confirmPassword: {
      label: "Confirm Password",
      type: FieldType.Password,
      required: true,
      placeholder: "Confirm Password",
    },
    productType: {
      label: "Product Type",
      type: FieldType.Checkbox,
      required: true,
      placeholder: "",
      options: {
        card: { label: "Card" },
        remittance: { label: "Remittance" },
        both: { label: "Both" }
      }
    
    }
  }
};
