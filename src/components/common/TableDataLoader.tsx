import React from "react";
import { Loader as LucideLoader } from "lucide-react";

type Props = {
  text?: string;
};

const TableDataLoader = ({ text = "Fetching..." }: Props) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <LucideLoader
        className="animate-spin"
        style={{ animationDuration: "1.5s" }}
      />
      {text}
    </div>
  );
};

export default TableDataLoader;
