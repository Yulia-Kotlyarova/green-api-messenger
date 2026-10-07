import { Button } from '@/components/ui/Button/Button';
import { useChat } from '@/context/ChatContext';
import { classNames } from '@/helpers/classNames';

import styles from './Sidebar.module.css';

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

						return (
							<button
								key={chat.id}
								type="button"
								className={classNames(styles.chat, {
									[styles.active]: activeChatId === chat.id,
								})}
								onClick={() => setActiveChatId(chat.id)}
							>
								<div className={styles.avatar}>{chat.name.charAt(0).toUpperCase()}</div>

								<div className={styles.chatContent}>
									<span className={styles.chatName}>{chat.name || chat.recipient}</span>

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
