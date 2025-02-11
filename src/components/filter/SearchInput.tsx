import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full sm:w-[250px]" >
      <Input
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="placeholder:text-[14px]"
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}
