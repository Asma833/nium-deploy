import { Order } from '../../types/updateIncident.types';

type Props = {
  rowData: Order;
};

const PurposeType = ({ rowData }: Props) => {
  const purposeTypeText =
    rowData?.purpose_type_name?.purpose_name || rowData?.purpose_type || '-';

  return <span>{purposeTypeText}</span>;
};

export default PurposeType;
