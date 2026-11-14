import { FileText, UploadCloud, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

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
        <div className={cn('flex w-full flex-col gap-3', className)}>
            <label
                htmlFor={inputId}
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
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-control border border-dashed border-border bg-rice-paper/60 p-6 text-center transition-colors duration-150 ease-nep hover:bg-rice-paper focus-within:ring-2 focus-within:ring-lacquer-red focus-within:ring-offset-2',
                    isDragging && 'border-lacquer-red bg-lacquer-wash/40',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
            >
                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    className="sr-only"
                    onChange={(event) => {
                        handleFiles(event.target.files);
                        event.target.value = '';
                    }}
                />
                <span className="flex size-11 items-center justify-center rounded-pill bg-raw-linen text-ink-muted">
                    <UploadCloud aria-hidden="true" className="size-6" />
                </span>
                <span className="text-body-sm text-ink">
                    <span className="font-semibold text-lacquer-red">Bấm để tải tệp lên</span> hoặc kéo thả vào đây
                </span>
                <span className="font-mono text-label-micro uppercase text-ink-faint">
                    Tối đa {formatFileSize(maxSize)} mỗi tệp
                </span>
            </label>

            {error && (
                <span role="alert" className="text-body-sm text-brick">
                    {error}
                </span>
            )}

            {files.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {files.map((file, index) => (
                        <li
                            key={`${file.name}-${file.lastModified}`}
                            className="flex items-center gap-3 rounded-chip border border-border bg-warm-porcelain p-2.5"
                        >
                            <span className="flex size-9 items-center justify-center rounded-chip bg-raw-linen text-ink-muted">
                                <FileText aria-hidden="true" className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-body-sm font-medium text-ink">{file.name}</span>
                                <span className="block font-mono text-label-micro text-ink-muted">
                                    {formatFileSize(file.size)}
                                </span>
                            </span>
                            {onRemove && (
                                <button
                                    type="button"
                                    aria-label={`Xoá ${file.name}`}
                                    className="flex size-control-sm items-center justify-center rounded-chip text-ink-faint transition-colors hover:bg-brick-soft hover:text-brick focus-ring"
                                    onClick={() => onRemove(index)}
                                >
                                    <X aria-hidden="true" className="size-4" />
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
