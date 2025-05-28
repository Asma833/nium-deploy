import { OrderRowData } from '../../types/updateIncident.types';

const PurposeType = ({ rowData }: OrderRowData) => {
  const purposeTypeText = rowData?.purpose_type_name?.purpose_name || '-';

  return <span>{purposeTypeText}</span>;
};

export default PurposeType;
