import { ChangeEvent, useState } from 'react';
import { FileUpload } from './FileUpload';

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
}

const FileUploadWithView = ({
  id,
  name,
  label,
  className,
}: FileUploadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
          <img
            src={fileUrl}
            alt={selectedFile.name}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
      );
    }

    if (fileType === 'application/pdf') {
      return (
        <div>
          <p className="mb-2">
            <strong>File:</strong> {selectedFile.name}
          </p>
          <iframe src={fileUrl} className="w-full h-96" title="PDF Preview" />
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
        <p className="text-gray-600">
          Preview not available for this file type.
        </p>
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-full">
        <span className="text-sm"> {label}</span>
        <div className="flex w-full gap-2">
          <FileUpload
            id={id || name}
            name={name}
            label={label}
            handleFileChange={handleFileChange}
            className="w-5/6 p-0"
            styleType="fileUploadWithView"
          />
          <button
            type="button"
            className={`px-2 bg-blue-600 text-white rounded w-1/6 ${className}`}
            onClick={() => setIsModalOpen(true)}
          >
            View
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-full md:min-w-[800px] md:max-w-[1100px] max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-bold mb-4">File Preview</h2>
            {renderFilePreview()}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithView;
