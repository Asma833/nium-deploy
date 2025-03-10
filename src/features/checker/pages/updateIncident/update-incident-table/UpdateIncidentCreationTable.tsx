
import { DynamicTable } from "@/components/common/DynamicTable";
import { getTransactionTableColumns } from "./update-incident-creation-table-col";
import { transactionTableData as initialData } from "./update-incident-table-value";
import {  useState } from "react";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import UpdateIncidentForm from "../incident-form/UpdateIncidentForm";




const UpdateIncidentCreationTable = () => {
  const [tableData] = useState(initialData);

  const [selectedNiumId, setSelectedNiumId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 // const formRef = useRef<() => void | null>(null); // Ref for triggering form submission

  const openModal = (value: string) => {
    setSelectedNiumId(value);
    setIsModalOpen(true);
  };

  const columns = getTransactionTableColumns(openModal);

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={tableData}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
      />

      {isModalOpen && (
        <DialogWrapper
          triggerBtnText=""
          title="Update Incident"
          footerBtnText=""
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          description={selectedNiumId ?? ""}
          renderContent={
            // <UpdateIncidentForm onSubmit={() => {
            //   if (formRef.current) formRef.current();
            // }} />
            <UpdateIncidentForm />
          }
         
        />
      )}
    </div>
  );
};

export default UpdateIncidentCreationTable;
