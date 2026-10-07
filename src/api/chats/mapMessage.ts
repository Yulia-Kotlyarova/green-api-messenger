import type { GetChatHistoryResponseItem } from './getChatHistory';

import type { MessageI } from '@/types/message';

export const mapMessage = (message: GetChatHistoryResponseItem): MessageI => ({
	id: message.idMessage,
	text: message.textMessage ?? '',
	direction: message.type,
	createdAt: message.timestamp * 1000,
});
