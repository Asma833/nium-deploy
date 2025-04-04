interface TableRow {
  currency: string;
  rate: number;
  amount: number;
}

const ExchangeRateDetails = ({ data }: { data: TableRow[] }) => {
  const totalCalculatedAmount = data.reduce(
    (acc, row) => acc + row.rate * row.amount,
    0
  );

  return (
    <div className="border rounded-md p-3 w-full">
      <div className="grid grid-cols-4 px-3 py-2 text-gray-500 font-semibold text-sm border-b">
        <span>Currency</span>
        <span>Rate</span>
        <span>Amount</span>
        <span>Calculate</span>
      </div>

      {data.map((row, index) => (
        <div key={index} className="grid grid-cols-4 px-3 py-2 text-sm">
          <span>{row.currency}</span>
          <span>{row.rate}</span>
          <span>{row.amount}</span>
          <span className="font-medium">
            {(row.rate * row.amount).toFixed(2)}
          </span>
        </div>
      ))}

      <div className="grid grid-cols-4 px-3 py-2 text-sm font-bold text-pink-500 border-t">
        <span className="col-span-2"></span>
        <span className="text-left">Total</span>
        <span>{totalCalculatedAmount.toFixed(2)}</span>
      </div>
    </div>
  );
};
export default ExchangeRateDetails;
