import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

import styles from './NewChatDialog.module.css';
import { useChat } from '@/context/ChatContext.tsx';

interface NewChatDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const NewChatDialog = ({ open, onOpenChange }: NewChatDialogProps) => {
	const [recipient, setRecipient] = useState('');
	const { chats, createChat } = useChat();

	const handleCreateChat = () => {
		const existingChat = chats.find((chat) => chat.recipient === recipient);

		if (!recipient.trim() || existingChat) {
			return;
		}

		console.log(recipient);
		createChat({
			recipient,
			name: recipient,
		});

		onOpenChange(false);
		setRecipient('');
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className={styles.overlay} />

				<Dialog.Content className={styles.content}>
					<div className={styles.header}>
						<Dialog.Title className={styles.title}>Новый чат</Dialog.Title>

						<Dialog.Description className={styles.description}>
							Введите username или номер телефона получателя
						</Dialog.Description>
					</div>

					<Input
						id={'recipient'}
						value={recipient}
						onChange={(event) => setRecipient(event.target.value)}
						placeholder="@username или номер телефона"
						autoFocus
					/>

					<div className={styles.actions}>
						<Dialog.Close asChild>
							<Button variant="secondary">Отмена</Button>
						</Dialog.Close>

						<Button onClick={handleCreateChat} disabled={!recipient.trim()}>
							Создать чат
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
