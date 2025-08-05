import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search' }: SearchInputProps) {
  return (
    <div className="relative w-full sm:w-[250px]">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="placeholder:text-[14px] pr-10"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          <X size={18} />
        </button>
      ) : (
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      )}
    </div>
  );
}
