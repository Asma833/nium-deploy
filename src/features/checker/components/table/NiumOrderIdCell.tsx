const NiumOrderID = ({
  rowData,
  openModal,
}: {
  rowData: any;
  openModal: (value: string) => void;
}) => {
  return (
    <button
      className="text-pink-600 cursor-pointer underline flex items-center justify-center gap-1 disabled:opacity-50"
      onClick={() => {
        openModal(rowData);
      }}
    >
      {rowData.nium_order_id}
    </button>
  );
};

export default NiumOrderID;
