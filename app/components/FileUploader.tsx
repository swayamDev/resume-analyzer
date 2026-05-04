import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const FileUploader = ({ onFileSelect, selectedFile }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect?.(acceptedFiles[0] ?? null);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="w-full gradient-border" role="region" aria-label="File upload area">
      <div
        {...getRootProps()}
        className={`uplader-drag-area transition-colors ${
          isDragActive ? "bg-blue-50 border-2 border-dashed border-indigo-400" : ""
        }`}
        aria-describedby="upload-hint"
      >
        <input {...getInputProps()} aria-label="Upload PDF file" />

        {selectedFile ? (
          <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
            <img src="/images/pdf.png" alt="PDF file" className="size-10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-red-50 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
              aria-label="Remove file"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect?.(null);
              }}
            >
              <img src="/icons/cross.svg" alt="" className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/info.svg" alt="" className="size-16 mb-1" aria-hidden="true" />
            <p className="text-base text-gray-600" id="upload-hint">
              <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-400">PDF only · max {formatSize(MAX_FILE_SIZE)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
