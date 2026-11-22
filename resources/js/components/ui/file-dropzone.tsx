import { FileText, UploadCloud, X } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type FileDropzoneProps = {
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    disabled?: boolean;
    files?: File[];
    onFiles: (files: File[]) => void;
    onRemove?: (index: number) => void;
    className?: string;
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDropzone({
    accept = 'image/*,video/*',
    maxSize = 50 * 1024 * 1024,
    multiple = true,
    disabled = false,
    files = [],
    onFiles,
    onRemove,
    className,
}: FileDropzoneProps) {
    const inputId = React.useId();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleFiles = (incoming: FileList | null) => {
        if (!incoming || disabled) {
            return;
        }

        const accepted = Array.from(incoming).filter((file) => file.size <= maxSize);

        if (accepted.length !== incoming.length) {
            setError(`Mỗi tệp phải nhỏ hơn ${formatFileSize(maxSize)}.`);
        } else {
            setError(null);
        }

        if (accepted.length > 0) {
            onFiles(multiple ? accepted : accepted.slice(0, 1));
        }
    };

    return (
        <div className={cx('sn-dropzone', className)}>
            <label
                htmlFor={inputId}
                data-dragging={isDragging ? 'true' : undefined}
                data-disabled={disabled ? 'true' : undefined}
                onDragOver={(event) => {
                    event.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    handleFiles(event.dataTransfer.files);
                }}
                className="sn-dropzone__label"
            >
                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    className="sn-dropzone__input"
                    onChange={(event) => {
                        handleFiles(event.target.files);
                        event.target.value = '';
                    }}
                />
                <span className="sn-dropzone__icon-wrap">
                    <UploadCloud aria-hidden="true" className="sn-dropzone__icon" />
                </span>
                <span className="sn-dropzone__text">
                    <span className="sn-dropzone__action">Bấm để tải tệp lên</span> hoặc kéo thả vào đây
                </span>
                <span className="sn-dropzone__hint">Tối đa {formatFileSize(maxSize)} mỗi tệp</span>
            </label>

            {error && (
                <span role="alert" className="sn-dropzone__error">
                    {error}
                </span>
            )}

            {files.length > 0 && (
                <ul className="sn-file-list">
                    {files.map((file, index) => (
                        <li key={`${file.name}-${file.lastModified}`} className="sn-file-row">
                            <span className="sn-file-row__icon-wrap">
                                <FileText aria-hidden="true" className="sn-file-row__icon" />
                            </span>
                            <span className="sn-file-row__body">
                                <span className="sn-file-row__name">{file.name}</span>
                                <span className="sn-file-row__size">{formatFileSize(file.size)}</span>
                            </span>
                            {onRemove && (
                                <button type="button" aria-label={`Xoá ${file.name}`} className="sn-file-row__remove" onClick={() => onRemove(index)}>
                                    <X aria-hidden="true" />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FileDropzone;
