import {
	type FormEvent,
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useRef,
	useState,
} from 'react';

import { Button } from '@/components/ui/Button/Button';
import { useChat } from '@/context/ChatContext';

import styles from './Chat.module.css';
import { formatMessageTime } from '@/helpers/formatMessageTime.ts';

export const Chat = () => {
	const { activeChat, isHistoryLoading, isMessageSending, sendMessage } = useChat();

	const [message, setMessage] = useState('');
	const messagesRef = useRef<HTMLDivElement>(null);

	const activeChatId = activeChat?.id;
	const messagesCount = activeChat?.messages.length;

	useEffect(() => {
		const container = messagesRef.current;

		if (!container || isHistoryLoading) {
			return;
		}

		container.scrollTop = container.scrollHeight;
	}, [activeChatId, messagesCount, isHistoryLoading]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const text = message.trim();

		if (!text || isMessageSending) {
			return;
		}

		await sendMessage(text);
		setMessage('');
	};

	const handleKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			event.currentTarget.form?.requestSubmit();
		}
	};

	if (!activeChat) {
		return (
			<section className={styles.chat}>
				<div className={styles.empty}>Выберите чат</div>
			</section>
		);
	}

	return (
		<section className={styles.chat}>
			<header className={styles.header}>
				<span className={styles.name}>{activeChat.name || activeChat.recipient}</span>

				<span className={styles.username}>{activeChat.recipient}</span>
			</header>

			<div className={styles.messages} ref={messagesRef}>
				{isHistoryLoading && <div className={styles.empty}>Загрузка сообщений...</div>}

				{!isHistoryLoading && activeChat.messages.length === 0 && (
					<div className={styles.empty}>Сообщений пока нет</div>
				)}

				{!isHistoryLoading &&
					activeChat.messages.map((item) => (
						<div
							key={item.id}
							className={item.direction === 'outgoing' ? styles.outgoing : styles.incoming}
						>
							<span className={styles.messageText}>{item.text}</span>

							<span className={styles.messageTime}>{formatMessageTime(item.createdAt)}</span>
						</div>
					))}
			</div>

			<form className={styles.composer} onSubmit={handleSubmit}>
				<textarea
					className={styles.textarea}
					value={message}
					placeholder="Написать сообщение..."
					rows={1}
					disabled={isMessageSending}
					onChange={(event) => setMessage(event.target.value)}
					onKeyDown={handleKeyDown}
				/>

				<Button type="submit" disabled={!message.trim() || isMessageSending}>
					Отправить
				</Button>
			</form>
		</section>
	);
};
