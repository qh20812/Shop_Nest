import { Send } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { cn } from '@/lib/utils';

type NewsletterSignupProps = {
    onSubmit?: (email: string) => void | Promise<void>;
    loading?: boolean;
    className?: string;
};

export function NewsletterSignup({ onSubmit, loading = false, className }: NewsletterSignupProps) {
    const [email, setEmail] = React.useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim()) {
            return;
        }

        onSubmit?.(email.trim());
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit} className={cn('flex w-full flex-col gap-2 sm:flex-row', className)}>
            <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email của bạn"
                aria-label="Email nhận bản tin"
                autoComplete="email"
                required
            />
            <Button type="submit" loading={loading} rightIcon={Send} className="shrink-0">
                Đăng ký
            </Button>
        </form>
    );
}

export default NewsletterSignup;
