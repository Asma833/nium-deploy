enum FieldType {
  Text = 'text',
  Email = 'email',
  Select = 'select',
}

interface FormField {
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
  options?: Record<string, { label: string }>;
}

interface SelectField extends FormField {
  type: FieldType.Select;
  options: Record<string, { label: string }>;
}

type Field = FormField | SelectField;

enum RoleOptions {
  Maker = 'maker',
  Checker = 'checker',
}

type Fields = {
  agentEonCode: Field;
  primaryAgentName: Field;
  primaryAgentEmail: Field;
  branchUserName: Field;
  branchUserEmail: Field;
  branchName: Field;
  branchCity: SelectField;
  branchState: SelectField;
  branchRegion: SelectField;
  niumRmUsername: Field;
  niumRmBranchName: Field;
  niumRmBranchRegion: SelectField;
};

interface AgentFormConfig {
  sectionTitle: string;
  fields: Fields;
  roleOptions: RoleOptions[];
}

export const agentFormConfig: AgentFormConfig = {
  sectionTitle: 'Agent Branch User Create',
  fields: {
    agentEonCode: {
      label: 'Agent EON Code',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Agent EON Code',
    },
    primaryAgentName: {
      label: 'Primary Agent Name',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Primary Agent Name',
    },
    primaryAgentEmail: {
      label: 'Primary Agent Email',
      type: FieldType.Email,
      required: true,
      placeholder: 'Enter Primary Agent Email',
    },
    branchUserName: {
      label: 'Branch User Name',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Branch User Name',
    },
    branchUserEmail: {
      label: 'Branch User Email',
      type: FieldType.Email,
      required: true,
      placeholder: 'Enter Branch User Email',
    },
    branchName: {
      label: 'Branch Name',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Branch Name',
    },
    branchCity: {
      label: 'Branch City',
      type: FieldType.Select,
      options: {
        city1: { label: 'City 1' },
        city2: { label: 'City 2' },
      },
      required: true,
      placeholder: 'Select Branch City',
    },
    branchState: {
      label: 'Branch State',
      type: FieldType.Select,
      options: {
        state1: { label: 'State 1' },
        state2: { label: 'State 2' },
      },
      required: true,
      placeholder: 'Select Branch State',
    },
    branchRegion: {
      label: 'Branch Region',
      type: FieldType.Select,
      options: {
        region1: { label: 'Region 1' },
        region2: { label: 'Region 2' },
      },
      required: true,
      placeholder: 'Select Branch Region',
    },
    niumRmUsername: {
      label: 'NIUM RM Username',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter NIUM RM Username',
    },
    niumRmBranchName: {
      label: 'NIUM RM Branch Name',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter NIUM RM Branch Name',
    },
    niumRmBranchRegion: {
      label: 'NIUM RM Branch Region',
      type: FieldType.Select,
      options: {
        regionA: { label: 'Region A' },
        regionB: { label: 'Region B' },
      },
      required: true,
      placeholder: 'Select NIUM RM Branch Region',
    },
  },
  roleOptions: [RoleOptions.Maker, RoleOptions.Checker],
};
