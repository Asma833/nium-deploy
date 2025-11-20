import { ChangeEvent, useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useFormContext } from 'react-hook-form';
import '../styles/form-layout.css';

interface FileUploadProps {
  id?: string;
  name: string;
  label: string;
  className?: string;
  maxFiles?: number;
  description?: string;
  helpText?: string;
  accept?: string;
  multiple?: boolean;
  viewFile?: boolean;
}

const FileUploadWithView = ({ id, name, label, className, viewFile = true }: FileUploadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { watch } = useFormContext();

  // Watch the form field to get the current file array
  const fileArray = watch(name) || [];

  useEffect(() => {
    // Update selectedFile when the form value changes
    if (fileArray.length > 0 && fileArray[0]?.file) {
      setSelectedFile(fileArray[0].file);
    } else {
      setSelectedFile(null);
    }
  }, [fileArray]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement> | null) => {
    if (e && e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) {
      return <div>No file selected.</div>;
    }

    const fileType = selectedFile.type;
    const fileUrl = URL.createObjectURL(selectedFile);

    if (fileType.startsWith('image/')) {
      return (
        <div>
          <p className="mb-2">
            <strong>File:</strong> {selectedFile.name}
          </p>
          <img src={fileUrl} alt={selectedFile.name} className="max-w-full h-[95vh] object-contain mx-auto" />
        </div>
      );
    }

    if (fileType === 'application/pdf') {
      return (
        <div>
          <p className="mb-2">
            <strong>File:</strong> {selectedFile.name}
          </p>
          <iframe src={fileUrl} className="w-full h-[95vh]" title="PDF Preview" />
        </div>
      );
    }

    return (
      <div>
        <p className="mb-2">
          <strong>File:</strong> {selectedFile.name}
        </p>
        <p className="mb-2">
          <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
        </p>
        <p className="text-gray-600">Preview not available for this file type.</p>
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-full">
        <span className="fileupload-label text-sm mb-2">{label}</span>
        <div className="flex w-full">
          <FileUpload
            id={id || name}
            name={name}
            label={label}
            handleFileChange={handleFileChange}
            className="w-5/6 p-0 flex-1"
            styleType="fileUploadWithView"
          />
          {viewFile && (
            <button
              type="button"
              disabled={!selectedFile}
              className={`px-2 text-gray-500 disabled:text-gray-400 hover:text-gray-800 text-sm border-none bg-transparent rounded w-[60px] flex items-center justify-center gap-2 ${className}`}
              onClick={() => setIsModalOpen(true)}
            >
              <Eye size={20} className="min-w-5" /> View
            </button>
          )}
        </div>
      </div>
      {isModalOpen && viewFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="relative bg-white p-6 rounded shadow-lg min-w-full md:min-w-[800px] lg:min-w-[1200px] md:max-w-[1100px] max-h-[95vh] overflow-auto">
            <h2 className="text-lg font-bold mb-4">File Preview</h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6 text-primary" />
            </button>
            {renderFilePreview()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithView;
