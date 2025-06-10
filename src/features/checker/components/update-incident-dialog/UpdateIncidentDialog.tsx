import { DialogWrapper } from '@/components/common/DialogWrapper';
import UpdateIncidentForm from '../../pages/update-incident/incident-form/UpdateIncidentForm';
import { UpdateIncidentDialogProps } from '../../types/updateIncident.types';

const UpdateIncidentDialog = (props: UpdateIncidentDialogProps) => {
  const { pageId, mode, selectedRowData, isModalOpen, setIsModalOpen } = props;
  return (
    <DialogWrapper
      title={mode === 'edit' ? 'Update Incident' : 'View Incident'}
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
