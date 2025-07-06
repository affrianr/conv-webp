"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  preview: string;
}

export function DropZone({
  onFileSelected,
  selectedFile,
  preview,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelected(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
      // Clear the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload image"
      className={`relative flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"} ${preview ? "bg-gray-50" : "bg-white"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        id="image-upload"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative h-full w-full">
          <Image
            src={preview}
            alt="Image preview"
            fill
            className="object-contain"
          />
          <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-2 text-center text-sm text-white">
            {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)}{" "}
            KB)
          </div>
        </div>
      ) : (
        <>
          <svg
            className="mb-4 h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mb-2 text-center text-sm font-medium text-gray-700">
            Drag and drop your image here, or click to select
          </p>
          <p className="text-center text-xs text-gray-500">
            Supports: JPG, PNG, GIF, WebP, SVG
          </p>
        </>
      )}
    </div>
  );
}
