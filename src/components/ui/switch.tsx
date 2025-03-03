import React, { useEffect, useState } from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked); // ✅ Sync with external updates
  }, [checked]);

  return (
    <button
      className={`relative w-12 h-6 flex items-center rounded-full transition-all 
      ${isChecked ? "bg-primary" : "bg-gray-300"}`}
      onClick={() => {
        setIsChecked(!isChecked); // ✅ Toggle local state
        onCheckedChange(!isChecked);
      }}
    >
      <div
        className={`absolute left-1 w-5 h-5 bg-white rounded-full shadow-md transform 
        transition-all ${isChecked ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
};

export default Switch;
