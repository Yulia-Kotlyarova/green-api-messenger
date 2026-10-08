import { useEffect, useState } from 'react';

import { Chat } from '@/components/Chat/Chat';
import { NewChatDialog } from '@/components/NewChatDialog/NewChatDialog';
import { Sidebar } from '@/components/Sidebar/Sidebar';

import styles from './ChatPage.module.css';
import { useChat } from '@/context/ChatContext.tsx';
import { useAuth } from '@/context/AuthContext.tsx';

export const ChatPage = () => {
	const { activeChatRecipient, loadChats, loadChatHistory } = useChat();
	const { credentials } = useAuth();

	const [isNewChatOpen, setIsNewChatOpen] = useState(false);

	useEffect(() => {
		void loadChats();
	}, [credentials?.idInstance]);

	useEffect(() => {
		if (!activeChatRecipient) {
			return;
		}

		loadChatHistory(activeChatRecipient);
	}, [activeChatRecipient, loadChatHistory]);

	return (
		<main className={styles.page}>
			<div className={styles.app}>
				<Sidebar onNewChat={() => setIsNewChatOpen(true)} />
				<Chat />
			</div>

			<NewChatDialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} />
		</main>
	);
};
