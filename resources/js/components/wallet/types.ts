export type WalletLayout = 'workspace' | 'account';

export interface WalletSummary {
    wallet_id: number;
    balance: number;
    total_earned: number;
    total_spent: number;
    currency: string;
    status: string;
}

export interface WalletBank {
    bank_bin: string;
    bank_name: string | null;
    account_no: string;
    account_name: string;
    template: string;
    configured: boolean;
}

export interface WalletLimits {
    min: number;
    max: number;
    ttl_hours: number;
}

export type TopupStatus = 'pending' | 'transferred' | 'approved' | 'rejected' | 'expired';

export interface WalletTopup {
    topup_id: number;
    code: string;
    status: TopupStatus;
    amount_declared: number;
    amount_received: number | null;
    transferred_at: string | null;
    approved_at: string | null;
    reject_reason: string | null;
    expires_at: string;
    created_at: string;
    metadata: Record<string, unknown> | null;
    qr_url: string | null;
    bank: WalletBank;
}

export interface WalletTransaction {
    transaction_id: number;
    type: string;
    direction: 'credit' | 'debit';
    amount: number;
    description: string | null;
    balance_after: number;
    created_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
}

export interface AdminTopup extends WalletTopup {
    user: {
        id: number;
        username: string | null;
        email: string | null;
    } | null;
    wallet_balance: number | null;
    approved_by: string | null;
}

export interface WalletFilters {
    type: string;
    from: string;
    to: string;
}

export interface WalletState {
    wallet: WalletSummary;
    activeTopup: WalletTopup | null;
    recentTopups: WalletTopup[];
    transactions: Paginated<WalletTransaction>;
    filters: WalletFilters;
    typeOptions: Record<string, string>;
    bank: WalletBank;
    limits: WalletLimits;
    presets: number[];
}

export interface WalletStateResponse extends WalletState {
    server_time: string;
}

export interface AdminQueueState {
    topups: Paginated<AdminTopup>;
    statusCounts: Record<string, number>;
    filters: AdminFilters;
    server_time: string;
}

export interface AdminFilters {
    status: string;
    code: string;
}
