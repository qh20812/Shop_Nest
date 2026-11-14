import { useCallback, useState } from 'react';

export type DisclosureState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setOpen: (open: boolean) => void;
};

/**
 * Small controlled/uncontrolled helper for dialogs, sheets and popovers.
 */
export function useDisclosure(defaultOpen = false): DisclosureState {
    const [isOpen, setOpen] = useState(defaultOpen);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen((current) => !current), []);

    return { isOpen, open, close, toggle, setOpen };
}
