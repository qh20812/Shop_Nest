import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface ConversationItem {
	id: number;
	name: string;
	lastMessage: string;
	timestamp: string;
	unreadCount?: number;
	pinned?: boolean;
}

interface ChatListProps {
	conversations: ConversationItem[];
	activeConversationId: number | null;
	onSelect: (conversationId: number) => void;
	isLoading?: boolean;
	error?: string | null;
	onRefresh?: () => void;
	onCompose?: () => void;
}

const FILTER_OPTIONS = ['Tất cả', 'Đã đọc', 'Đã ghim', 'Chưa đọc'] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

const ChatList: React.FC<ChatListProps> = ({ conversations, activeConversationId, onSelect, isLoading = false, error = null, onRefresh, onCompose }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState<FilterOption>('Tất cả');
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const normalizedError = (error ?? '').trim().toLowerCase();
	const isUnauthenticatedError = normalizedError === 'unauthenticated.' || normalizedError === 'unauthenticated';

	useEffect(() => {
		const handleClickAway = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickAway);
		return () => document.removeEventListener('mousedown', handleClickAway);
	}, []);

	const handleFilterSelect = (filter: FilterOption) => {
		setSelectedFilter(filter);
		setIsDropdownOpen(false);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const filteredConversations = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		return conversations
			.filter((conversation) => {
				if (!normalizedSearch) {
					return true;
				}

				return (
					conversation.name.toLowerCase().includes(normalizedSearch) ||
					conversation.lastMessage.toLowerCase().includes(normalizedSearch)
				);
			})
			.filter((conversation) => {
				switch (selectedFilter) {
					case 'Đã đọc':
						return (conversation.unreadCount ?? 0) === 0;
					case 'Chưa đọc':
						return (conversation.unreadCount ?? 0) > 0;
					case 'Đã ghim':
						return Boolean(conversation.pinned);
					default:
						return true;
				}
			});
	}, [conversations, selectedFilter, searchTerm]);

	const renderContent = () => {
		if (isLoading) {
			return <div className="chat-sidebar-empty">Đang tải cuộc trò chuyện...</div>;
		}

		if (error) {
			if (isUnauthenticatedError) {
				return (
					<div className="chat-sidebar-empty">
						<p>Vui lòng đăng nhập để sử dụng tính năng này.</p>
						<button
							type="button"
							className="chat-sidebar-retry"
							onClick={() => {
								window.location.href = '/login';
							}}
						>
							Đăng nhập ngay
						</button>
					</div>
				);
			}

			return (
				<div className="chat-sidebar-empty">
					<p>{error}</p>
					{onRefresh && (
						<button type="button" className="chat-sidebar-retry" onClick={onRefresh}>
							Thử lại
						</button>
					)}
				</div>
			);
		}

		if (filteredConversations.length === 0) {
			return <div className="chat-sidebar-empty">Không tìm thấy cuộc trò chuyện.</div>;
		}

		return filteredConversations.map((conversation) => {
			const isActive = activeConversationId === conversation.id;
			const isUnread = (conversation.unreadCount ?? 0) > 0;
			const avatarLabel = conversation.name.trim().charAt(0).toUpperCase();

			return (
				<button
					type="button"
					key={conversation.id}
					className={`chat-sidebar-item${isActive ? ' chat-sidebar-item--active' : ''}`}
					onClick={() => onSelect(conversation.id)}
				>
					<div className="chat-sidebar-avatar" aria-hidden>
						{avatarLabel || 'C'}
					</div>
					<div className="chat-sidebar-content">
						<div className="chat-sidebar-row">
							<span className="chat-sidebar-name">{conversation.name}</span>
							<time className="chat-sidebar-time">{conversation.timestamp}</time>
						</div>
						<p className="chat-sidebar-preview">{conversation.lastMessage}</p>
					</div>
					{conversation.pinned && <span className="chat-sidebar-pin" aria-label="Đã ghim">★</span>}
					{isUnread && <span className="chat-sidebar-badge">Mới</span>}
				</button>
			);
		});
	};

	return (
		<aside className="chat-sidebar">
			<div className="chat-sidebar-header">
				<h3 className="chat-sidebar-title">Tin nhắn</h3>
				<button type="button" className="chat-sidebar-compose" onClick={() => onCompose?.()} disabled={!onCompose}>
					Soạn mới
				</button>
			</div>

			<div className="chat-sidebar-search">
				<div className="chat-sidebar-search-row">
					<input
						type="text"
						placeholder="Tìm kiếm..."
						className="chat-sidebar-search-input"
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<div className="chat-filter-wrapper" ref={dropdownRef}>
						<button
							type="button"
							className="chat-filter-toggle"
							aria-haspopup="true"
							aria-expanded={isDropdownOpen}
							onClick={() => setIsDropdownOpen((open) => !open)}
						>
							⋮
						</button>
						{isDropdownOpen && (
							<ul className="chat-filter-dropdown" role="menu">
								{FILTER_OPTIONS.map((filter) => (
									<li key={filter} role="none">
										<button
												type="button"
												role="menuitemradio"
												aria-checked={selectedFilter === filter}
												className={`chat-filter-option${selectedFilter === filter ? ' chat-filter-option--active' : ''}`}
												onClick={() => handleFilterSelect(filter)}
										>
											{filter}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
				<div className="chat-filter-active">Đang lọc: {selectedFilter}</div>
			</div>

			<div className="chat-sidebar-list">{renderContent()}</div>
		</aside>
	);
};

export default ChatList;
