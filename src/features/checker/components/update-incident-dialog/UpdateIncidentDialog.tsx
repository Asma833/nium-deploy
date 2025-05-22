import { DialogWrapper } from '@/components/common/DialogWrapper';
import UpdateIncidentForm from '../../pages/update-incident/incident-form/UpdateIncidentForm';
import { Order, UpdateIncidentFormData } from '../../types/updateIncident.type';

type Props = {
  pageId: string;
  mode: string;
  selectedRowData: Order & {
    incident_number?: string;
    eon_invoice_number?: string;
    transaction_mode?: string;
    status?: {
      approve: boolean;
      reject: boolean;
    };
  };
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const UpdateIncidentDialog = (props: Props) => {
  const {
    pageId,
    mode = 'Edit',
    selectedRowData,
    isModalOpen,
    setIsModalOpen,
  } = props;
  return (
    <DialogWrapper
      triggerBtnText=""
      title="Update Incident"
      footerBtnText=""
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      renderContent={
        <UpdateIncidentForm
          formActionRight="view"
          rowData={selectedRowData}
          pageId={pageId}
          mode={mode}
          setIsModalOpen={setIsModalOpen}
        />
      }
    />
  );
};

export default UpdateIncidentDialog;
