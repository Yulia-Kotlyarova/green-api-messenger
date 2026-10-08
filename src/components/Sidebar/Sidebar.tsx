import { Button } from '@/components/ui/Button/Button';
import { useChat } from '@/context/ChatContext';
import { classNames } from '@/helpers/classNames';

import styles from './Sidebar.module.css';
import { formatMessageTime } from '@/helpers/formatMessageTime.ts';
import { getInitials } from '@/helpers/getInitials.ts';

interface SidebarProps {
	onNewChat: () => void;
}

export const Sidebar = ({ onNewChat }: SidebarProps) => {
	const { chats, activeChatId, isLoadingChartsList, setActiveChatId } = useChat();

	return (
		<aside className={styles.sidebar}>
			<header className={styles.header}>
				<h1 className={styles.title}>Telegram Chat</h1>
			</header>

			<div className={styles.content}>
				<Button onClick={onNewChat}>+ Новый чат</Button>

				<div className={styles.chatList}>
					{isLoadingChartsList && <span className={styles.status}>Загрузка чатов...</span>}

					{!isLoadingChartsList && chats.length === 0 && (
						<span className={styles.status}>Чатов пока нет</span>
					)}

					{chats.map((chat) => {
						const lastMessage = chat.messages.at(-1);
						const name = chat.name || chat.recipient;
						const isActive = activeChatId === chat.id;

						return (
							<button
								key={chat.id}
								type="button"
								className={classNames(styles.chat, {
									[styles.active]: isActive,
								})}
								onClick={() => setActiveChatId(chat.id)}
								aria-current={isActive ? 'true' : undefined}
							>
								<div className={styles.avatar}>{getInitials(name)}</div>

								<div className={styles.chatContent}>
									<div className={styles.chatInfo}>
										<span className={styles.chatName} title={name}>
											{name}
										</span>

										{lastMessage && (
											<time
												className={styles.chatTime}
												dateTime={new Date(lastMessage.createdAt).toISOString()}
											>
												{formatMessageTime(lastMessage.createdAt)}
											</time>
										)}
									</div>

									<span className={styles.chatMessage}>{lastMessage?.text ?? chat.recipient}</span>
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</aside>
	);
};
