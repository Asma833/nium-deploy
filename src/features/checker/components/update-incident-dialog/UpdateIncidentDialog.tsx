import { DialogWrapper } from '@/components/common/DialogWrapper';
import UpdateIncidentForm from '../../pages/update-incident/incident-form/UpdateIncidentForm';
import { IncidentMode, UpdateIncidentDialogProps } from '../../types/updateIncident.types';

const UpdateIncidentDialog = (props: UpdateIncidentDialogProps) => {
  const { pageId, mode, selectedRowData, isModalOpen, setIsModalOpen } = props;
  return (
    <DialogWrapper
      title={
        mode === IncidentMode.EDIT
          ? 'Update Incident'
          : mode === IncidentMode.EDIT_INVOICE
            ? 'Update Invoice Number'
            : 'View Incident'
      }
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
