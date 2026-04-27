import { useCallback } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';

/**
 * FileUpload — drag & drop file upload with preview list.
 * 
 * @param {File[]} files
 * @param {function} onChange - (files: File[]) => void
 * @param {string} accept - comma-separated MIME or extensions
 * @param {number} maxSize - max size in bytes (default 5MB)
 * @param {boolean} multiple
 * @param {string} error
 */
const FileUpload = ({
  files = [],
  onChange,
  accept = '.pdf,.docx,.jpg,.jpeg',
  maxSize = 5 * 1024 * 1024,
  multiple = true,
  error,
}) => {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [files]
  );

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    e.target.value = '';
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter((f) => f.size <= maxSize);
    if (multiple) {
      onChange([...files, ...validFiles]);
    } else {
      onChange(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200 hover:border-[#8B0000]/40 hover:bg-red-50/30
          ${error ? 'border-red-400 bg-red-50/20' : 'border-gray-300 bg-gray-50/50'}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            Klik atau seret file ke sini
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, DOCX atau JPG (Maks. 5MB)
          </p>
        </label>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getFileIcon(file)}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-100 rounded-md transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
