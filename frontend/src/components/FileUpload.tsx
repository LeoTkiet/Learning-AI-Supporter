import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  acceptedTypes?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = "image/*",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-12 h-12 text-indigo-500 mb-3" />
          <p className="mb-2 text-sm text-gray-700 font-medium">
            <span className="font-semibold text-indigo-600">Nhấn để tải ảnh</span> hoặc kéo thả vào đây
          </p>
          <p className="text-xs text-gray-500">Hỗ trợ PNG, JPG, JPEG (Ảnh chụp bài tự luận)</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileChange}
        />
      </label>

      {selectedFile && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
