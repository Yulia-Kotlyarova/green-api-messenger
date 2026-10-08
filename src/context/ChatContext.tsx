import {
	createContext,
	useContext,
	useMemo,
	useState,
	type PropsWithChildren,
	useEffect,
	useCallback,
	useRef,
} from 'react';

import { getChats } from '@/api/chats/getChats';
import { mapChat } from '@/api/chats/mapChat';
import { useAuth } from '@/context/AuthContext';
import type { ChatI } from '@/types/chat';
import type { MessageI } from '@/types/message';
import { mapMessage } from '@/api/chats/mapMessage.ts';
import { getChatHistory } from '@/api/chats/getChatHistory.ts';
import { sendMessageApi } from '@/api/chats/sendMessageApi.ts';
import { receiveNotificationApi } from '@/api/notification/receiveNotification/receiveNotification.ts';
import { deleteNotificationApi } from '@/api/notification/deleteNotification/deleteNotification.ts';
import { checkAccountApi } from '@/api/chats/checkAccountApi.ts';

interface CreateChatParams {
	recipient: string;
	name: string;
}

interface AddMessageParams {
	chatId: string;
	text: string;
	direction: MessageI['direction'];
}

interface ChatContextValue {
	chats: ChatI[];
	activeChatId: string | null;
	activeChat: ChatI | null;
	activeChatRecipient?: string;
	isLoadingChartsList: boolean;
	isHistoryLoading: boolean;
	isMessageSending: boolean;
	setActiveChatId: (chatId: string) => void;
	loadChats: () => Promise<ChatI[]>;
	loadChatHistory: (chatId: string) => Promise<void>;
	createChat: (params: CreateChatParams) => void;
	addMessage: (params: AddMessageParams) => void;
	sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: PropsWithChildren) => {
	const { credentials } = useAuth();
	const idInstance = credentials?.idInstance;
	const apiTokenInstance = credentials?.apiTokenInstance;

	const [chats, setChats] = useState<ChatI[]>([]);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [isLoadingChartsList, setIsLoadingChartsList] = useState(false);
	const [isHistoryLoading, setIsHistoryLoading] = useState(false);
	const [isMessageSending, setIsMessageSending] = useState(false);

	const isCheckingNotificationsRef = useRef(false);

	const activeChat = useMemo(
		() => chats.find((chat) => chat.id === activeChatId) ?? null,
		[chats, activeChatId],
	);

	const activeChatRecipient = activeChat?.recipient;

	const loadChats = useCallback(async () => {
		if (!idInstance || !apiTokenInstance) {
			return [];
		}

		setIsLoadingChartsList(true);

		try {
			const response = await getChats({
				idInstance,
				apiTokenInstance,
			});

			const loadedChats = response.map(mapChat);

			setChats((currentChats) => {
				const localChats = currentChats.filter(
					(currentChat) =>
						!loadedChats.some((loadedChat) => loadedChat.recipient === currentChat.recipient),
				);

				return [...localChats, ...loadedChats];
			});

			return loadedChats;
		} catch (error) {
			console.error('Failed to load chats', error);

			return [];
		} finally {
			setIsLoadingChartsList(false);
		}
	}, [idInstance, apiTokenInstance]);

	const createChat = async ({ recipient, name }: CreateChatParams) => {
		if (!idInstance || !apiTokenInstance) {
			return;
		}

		const existingChat = chats.find((chat) => chat.recipient === recipient);

		if (existingChat) {
			setActiveChatId(existingChat.id);
			return;
		}

		const account = await checkAccountApi({
			idInstance,
			apiTokenInstance,
			phoneNumber: recipient,
		});

		if (!account.exist || !account.chatId) {
			throw new Error('Пользователь с таким номером не найден в Telegram');
		}

		const chat: ChatI = {
			id: account.chatId,
			recipient,
			name: name || account.username || recipient,
			messages: [],
		};

		setChats((currentChats) => [chat, ...currentChats]);
		setActiveChatId(chat.id);
	};

	const addMessage = ({ chatId, text, direction }: AddMessageParams) => {
		const message: MessageI = {
			id: crypto.randomUUID(),
			text,
			direction,
			createdAt: Date.now(),
		};

		setChats((currentChats) =>
			currentChats.map((chat) => {
				if (chat.id !== chatId) {
					return chat;
				}

				return {
					...chat,
					messages: [...chat.messages, message],
				};
			}),
		);
	};

	const loadChatHistory = useCallback(
		async (recipient: string) => {
			if (!idInstance || !apiTokenInstance) {
				return;
			}

			setIsHistoryLoading(true);

			try {
				const response = await getChatHistory({
					idInstance,
					apiTokenInstance,
					chatId: recipient,
				});

				const messages = response
					.map(mapMessage)
					.filter((message) => message.text)
					.reverse();

				setChats((currentChats) =>
					currentChats.map((chat) => {
						if (chat.recipient !== recipient) {
							return chat;
						}

						return {
							...chat,
							messages,
						};
					}),
				);
			} finally {
				setIsHistoryLoading(false);
			}
		},
		[idInstance, apiTokenInstance],
	);

	const sendMessage = async (message: string) => {
		if (!idInstance || !apiTokenInstance || !activeChat) {
			return;
		}

		const chatId = activeChat.id;

		try {
			setIsMessageSending(true);

			await sendMessageApi({
				idInstance,
				apiTokenInstance,
				chatId: activeChat.id,
				message,
			});

			addMessage({
				chatId,
				text: message,
				direction: 'outgoing',
			});
		} catch (error) {
			console.error('Failed to send message', error);
		} finally {
			setIsMessageSending(false);
		}
	};

	const checkNotifications = useCallback(async () => {
		if (!idInstance || !apiTokenInstance || isCheckingNotificationsRef.current) {
			return;
		}

		try {
			isCheckingNotificationsRef.current = true;

			const notification = await receiveNotificationApi({
				idInstance,
				apiTokenInstance,
			});

			if (!notification) {
				return;
			}

			const { receiptId, body } = notification;

			const isTextMessage = body.messageData?.typeMessage === 'textMessage';

			const isMessageReceived =
				body.typeWebhook === 'incomingMessageReceived' ||
				body.typeWebhook === 'outgoingAPIMessageReceived';

			if (isMessageReceived && isTextMessage) {
				const messageId = body.idMessage;
				const text = body.messageData?.textMessageData?.textMessage;
				const chatId = body.senderData?.chatId;

				if (messageId && text && chatId) {
					const message: MessageI = {
						id: messageId,
						text,
						direction: body.typeWebhook === 'incomingMessageReceived' ? 'incoming' : 'outgoing',
						createdAt: body.timestamp,
					};

					setChats((currentChats) =>
						currentChats.map((chat) => {
							if (chat.id !== chatId) {
								return chat;
							}

							const messageAlreadyExists = chat.messages.some((item) => item.id === message.id);

							if (messageAlreadyExists) {
								return chat;
							}

							return {
								...chat,
								messages: [...chat.messages, message],
							};
						}),
					);
				}
			}

			await deleteNotificationApi({
				idInstance,
				apiTokenInstance,
				receiptId,
			});
		} catch (error) {
			console.error('Failed to check notifications', error);
		} finally {
			isCheckingNotificationsRef.current = false;
		}
	}, [idInstance, apiTokenInstance]);

	useEffect(() => {
		if (!idInstance || !apiTokenInstance) {
			return;
		}

		const intervalId = setInterval(() => {
			void checkNotifications();
		}, 5000);

		return () => {
			clearInterval(intervalId);
		};
	}, [idInstance, apiTokenInstance, checkNotifications]);

	return (
		<ChatContext.Provider
			value={{
				chats,
				activeChatId,
				activeChat,
				activeChatRecipient,
				isLoadingChartsList,
				isHistoryLoading,
				isMessageSending,
				setActiveChatId,
				loadChats,
				createChat,
				addMessage,
				loadChatHistory,
				sendMessage,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error('useChat must be used within ChatProvider');
	}

	return context;
};
