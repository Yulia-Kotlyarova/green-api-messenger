import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/Button/Button';
import { useChat } from '@/context/ChatContext';

import styles from './Chat.module.css';

export const Chat = () => {
	const { activeChat, isHistoryLoading, isMessageSending, sendMessage } = useChat();

	const [message, setMessage] = useState('');

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const text = message.trim();

		if (!text || isMessageSending) {
			return;
		}

		await sendMessage(text);
		setMessage('');
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

			<div className={styles.messages}>
				{isHistoryLoading && <div className={styles.empty}>Загрузка сообщений...</div>}

				{!isHistoryLoading && activeChat.messages.length === 0 && (
					<div className={styles.empty}>Сообщений пока нет</div>
				)}

				{!isHistoryLoading &&
					activeChat.messages.map((message) => (
						<div
							key={message.id}
							className={message.direction === 'outgoing' ? styles.outgoing : styles.incoming}
						>
							{message.text}
						</div>
					))}
			</div>

			<form className={styles.composer} onSubmit={handleSubmit}>
				<textarea
					className={styles.textarea}
					value={message}
					placeholder="Сообщение"
					rows={1}
					disabled={isMessageSending}
					onChange={(event) => setMessage(event.target.value)}
				/>

				<Button type="submit" disabled={!message.trim() || isMessageSending}>
					Отправить
				</Button>
			</form>
		</section>
	);
};
