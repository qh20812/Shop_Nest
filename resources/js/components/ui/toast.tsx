import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type ToastTone = 'success' | 'error' | 'warning' | 'info';

export type ToastAction = {
    label: string;
    onClick: () => void;
};

export type ToastItem = {
    id: string;
    tone: ToastTone;
    title: string;
    description?: string;
    duration?: number;
    action?: ToastAction;
};

type LegacyToastType = 'success' | 'danger' | 'warning' | 'info' | 'error';

export type ToastInput = {
    tone?: ToastTone;
    type?: LegacyToastType;
    title: string;
    description?: string;
    message?: string;
    duration?: number;
    action?: ToastAction;
};

let toastItems: ToastItem[] = [];
const listeners = new Set<() => void>();
const emptySnapshot: ToastItem[] = [];

function emit(): void {
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot(): ToastItem[] {
    return toastItems;
}

function getServerSnapshot(): ToastItem[] {
    return emptySnapshot;
}

function createId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeTone(input: ToastInput): ToastTone {
    if (input.tone) {
        return input.tone;
    }

    if (input.type === 'danger' || input.type === 'error') {
        return 'error';
    }

    return input.type ?? 'info';
}

export function dismissToast(id: string): void {
    toastItems = toastItems.filter((item) => item.id !== id);
    emit();
}

export function toast(input: ToastInput): string {
    const item: ToastItem = {
        id: createId(),
        tone: normalizeTone(input),
        title: input.title,
        description: input.description ?? input.message,
        duration: input.duration,
        action: input.action,
    };

    toastItems = [...toastItems, item];
    emit();

    return item.id;
}

export function useToast() {
    const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const addToast = React.useCallback((input: ToastInput) => toast(input), []);
    const removeToast = React.useCallback((id: string) => dismissToast(id), []);
    const success = React.useCallback(
        (title: string, message?: string, duration?: number) => toast({ tone: 'success', title, description: message, duration }),
        [],
    );
    const error = React.useCallback(
        (title: string, message?: string, duration?: number) => toast({ tone: 'error', title, description: message, duration }),
        [],
    );
    const warning = React.useCallback(
        (title: string, message?: string, duration?: number) => toast({ tone: 'warning', title, description: message, duration }),
        [],
    );
    const info = React.useCallback(
        (title: string, message?: string, duration?: number) => toast({ tone: 'info', title, description: message, duration }),
        [],
    );

    return { toasts: items, addToast, removeToast, success, error, warning, info, toast };
}

const toneClasses: Record<ToastTone, string> = {
    success: 'bg-jade-soft text-jade',
    error: 'bg-brick-soft text-brick',
    warning: 'bg-turmeric-soft text-turmeric',
    info: 'bg-lacquer-wash text-lacquer-deep',
};

const toneIcons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

type ToastProps = {
    item: ToastItem;
    onClose: (id: string) => void;
};

export function Toast({ item, onClose }: ToastProps) {
    const Icon = toneIcons[item.tone];

    React.useEffect(() => {
        if (item.duration === 0) {
            return;
        }

        const timeout = window.setTimeout(() => onClose(item.id), item.duration ?? 5_000);

        return () => window.clearTimeout(timeout);
    }, [item.duration, item.id, onClose]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="flex w-full items-start gap-3 rounded-card border border-border bg-warm-porcelain p-4 shadow-float"
        >
            <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-chip', toneClasses[item.tone])}>
                <Icon aria-hidden="true" className="size-5" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-sm font-semibold text-ink">{item.title}</span>
                {item.description && <span className="text-body-sm text-ink-muted">{item.description}</span>}
                {item.action && (
                    <button
                        type="button"
                        className="mt-1 w-fit text-body-sm font-medium text-lacquer-red underline-offset-4 hover:underline focus-ring"
                        onClick={() => {
                            item.action?.onClick();
                            onClose(item.id);
                        }}
                    >
                        {item.action.label}
                    </button>
                )}
            </div>
            <button
                type="button"
                aria-label="Đóng thông báo"
                className="flex size-control-sm shrink-0 items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-raw-linen hover:text-ink focus-ring"
                onClick={() => onClose(item.id)}
            >
                <X aria-hidden="true" className="size-4" />
            </button>
        </div>
    );
}

export function Toaster() {
    const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    if (items.length === 0) {
        return null;
    }

    return (
        <div
            aria-label="Thông báo"
            className="fixed bottom-4 left-4 right-4 z-toast flex flex-col gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-chat-panel"
        >
            {items.map((item) => (
                <Toast key={item.id} item={item} onClose={dismissToast} />
            ))}
        </div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
