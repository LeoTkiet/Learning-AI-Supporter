"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertTriangle } from "lucide-react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function FileUploader({ onFileSelected, isLoading = false }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chỉ chọn file hình ảnh (PNG, JPG, JPEG).");
      return;
    }
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    onFileSelected(file);
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-slate-500 bg-slate-900/50"
        } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-48 h-36 rounded-lg overflow-hidden border border-slate-700 shadow-md">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Đã chọn: {fileName}</span>
            </div>
            <p className="text-xs text-slate-400">Nhấn vào đây để đổi ảnh khác</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-200">
                Kéo thả ảnh bài làm vào đây, hoặc <span className="text-blue-400 underline">chọn từ thiết bị</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Hỗ trợ ảnh chụp chữ viết tay từ vở bài tập (PNG, JPG tối đa 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
