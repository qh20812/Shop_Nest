import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { appendCsrfToken } from '@/lib/csrf';

interface ParticipantSummary {
    id: number;
    name: string;
}

interface RawParticipant {
    id?: unknown;
    name?: unknown;
    username?: unknown;
    first_name?: unknown;
    last_name?: unknown;
    email?: unknown;
}

interface CreateConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConversationCreated: (payload: unknown) => void;
    currentUserId: number | null;
    csrfToken: string;
}

const MAX_RESULTS = 10;
const sanitizeString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const toParticipantSummary = (raw: unknown): ParticipantSummary | null => {
    if (typeof raw !== 'object' || raw === null) {
        return null;
    }

    const candidate = raw as RawParticipant;
    const numericId = typeof candidate.id === 'number' ? candidate.id : Number(candidate.id);

    if (!Number.isFinite(numericId)) {
        return null;
    }

    const fullName = [candidate.first_name, candidate.last_name]
        .map(sanitizeString)
        .filter(Boolean)
        .join(' ')
        .trim();

    const possibleNames = [
        sanitizeString(candidate.name),
        fullName,
        sanitizeString(candidate.username),
        sanitizeString(candidate.email),
    ].filter(Boolean);

    const name = possibleNames[0] ?? `Người dùng #${numericId}`;

    return {
        id: numericId,
        name,
    };
};

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({ isOpen, onClose, onConversationCreated, currentUserId, csrfToken }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<ParticipantSummary[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<ParticipantSummary | null>(null);
    const [message, setMessage] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const trimmedSearch = searchTerm.trim();
    const isBusy = isSearching || isSubmitting;
    const isSubmitDisabled = !selectedParticipant || message.trim().length === 0 || isBusy;

    const resetForm = useCallback(() => {
        setSearchTerm('');
        setResults([]);
        setSelectedParticipant(null);
        setMessage('');
        setError(null);
        setHasSearched(false);
    }, []);

    const handleClose = useCallback(() => {
        if (isBusy) {
            return;
        }

        resetForm();
        onClose();
    }, [isBusy, onClose, resetForm]);

    const performSearch = useCallback(async () => {
        const term = searchTerm.trim();

        if (term.length === 0) {
            setResults([]);
            setHasSearched(false);
            setError(null);
            return;
        }

        if (isSearching) {
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            const response = await axios.get('/chat/users/search', {
                params: {
                    q: term,
                    limit: MAX_RESULTS,
                },
            });

            const payload = Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : [];
            const participants: ParticipantSummary[] = [];

            payload.forEach((candidate: unknown) => {
                const summary = toParticipantSummary(candidate);

                if (!summary) {
                    return;
                }

                if (currentUserId !== null && summary.id === currentUserId) {
                    return;
                }

                participants.push(summary);
            });

            setResults(participants);
        } catch (searchError: unknown) {
            const message = axios.isAxiosError(searchError)
                ? searchError.response?.data?.message ?? searchError.message ?? 'Không thể tìm kiếm người dùng.'
                : 'Không thể tìm kiếm người dùng.';

            setError(message);
        } finally {
            setIsSearching(false);
            setHasSearched(true);
        }
    }, [currentUserId, isSearching, searchTerm]);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const content = message.trim();

        if (!selectedParticipant || content.length === 0) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axios.post('/chat/conversations', appendCsrfToken({
                receiver_id: selectedParticipant.id,
                content,
            }, csrfToken));

            onConversationCreated(response.data);
            setIsSubmitting(false);
            resetForm();
            onClose();
            return;
        } catch (submitError: unknown) {
            const message = axios.isAxiosError(submitError)
                ? submitError.response?.data?.message ?? submitError.message ?? 'Không thể tạo cuộc trò chuyện.'
                : 'Không thể tạo cuộc trò chuyện.';

            setError(message);
            setIsSubmitting(false);
        }
    }, [csrfToken, message, onClose, onConversationCreated, resetForm, selectedParticipant]);

    const handleResultSelect = useCallback((participant: ParticipantSummary) => {
        setSelectedParticipant(participant);
        setSearchTerm(participant.name);
        setError(null);
    }, []);

    const handleInputKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                void performSearch();
            }
        },
        [performSearch],
    );

    if (!isOpen) {
        return null;
    }

    const renderResults = () => {
        if (error) {
            return <div className="chat-modal-status chat-modal-status--error">{error}</div>;
        }

        if (!hasSearched && results.length === 0) {
            return <div className="chat-modal-status">Nhập từ khóa để tìm kiếm người dùng.</div>;
        }

        if (isSearching && results.length === 0) {
            return <div className="chat-modal-status">Đang tìm kiếm...</div>;
        }

        if (results.length === 0) {
            return <div className="chat-modal-status">Không tìm thấy người dùng phù hợp.</div>;
        }

        return (
            <ul className="chat-modal-results">
                {results.map((participant) => (
                    <li key={participant.id}>
                        <button
                            type="button"
                            className={`chat-modal-result${selectedParticipant?.id === participant.id ? ' chat-modal-result--active' : ''}`}
                            onClick={() => handleResultSelect(participant)}
                            disabled={isSubmitting}
                        >
                            {participant.name}
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="chat-modal-backdrop" role="dialog" aria-modal="true">
            <div className="chat-modal">
                <header className="chat-modal-header">
                    <h3 className="chat-modal-title">Tạo cuộc trò chuyện mới</h3>
                    <button type="button" className="chat-modal-close" onClick={handleClose} disabled={isBusy}>
                        ×
                    </button>
                </header>

                <form className="chat-modal-form" onSubmit={handleSubmit}>
                    <label className="chat-modal-label" htmlFor="chat-participant">
                        Người dùng
                    </label>
                    <div className="chat-modal-search">
                        <input
                            id="chat-participant"
                            type="text"
                            value={searchTerm}
                            placeholder="Nhập tên hoặc email..."
                            className="chat-modal-input"
                            onChange={(event) => setSearchTerm(event.target.value)}
                            onKeyDown={handleInputKeyDown}
                            onBlur={() => {
                                if (selectedParticipant && selectedParticipant.name !== searchTerm.trim()) {
                                    setSelectedParticipant(null);
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="chat-modal-search-button"
                            onClick={() => void performSearch()}
                            disabled={isBusy || trimmedSearch.length === 0}
                        >
                            Tìm kiếm
                        </button>
                    </div>

                    <div className="chat-modal-results-wrapper">{renderResults()}</div>

                    <label className="chat-modal-label" htmlFor="chat-message">
                        Tin nhắn đầu tiên
                    </label>
                    <textarea
                        id="chat-message"
                        className="chat-modal-textarea"
                        placeholder="Nhập tin nhắn của bạn..."
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={4}
                    />

                    <footer className="chat-modal-actions">
                        <button type="button" className="chat-modal-button chat-modal-button--muted" onClick={handleClose} disabled={isBusy}>
                            Hủy
                        </button>
                        <button type="submit" className="chat-modal-button chat-modal-button--primary" disabled={isSubmitDisabled}>
                            Tạo cuộc trò chuyện
                        </button>
                    </footer>

                    {isSubmitting && <div className="chat-modal-status chat-modal-status--inline">Đang tạo cuộc trò chuyện...</div>}
                </form>
            </div>
        </div>
    );
};

export default CreateConversationModal;
