import type { GetChatsResponseItem } from './getChats';

import type { ChatI } from '@/types/chat';

export const mapChat = (chat: GetChatsResponseItem): ChatI => ({
	id: chat.chatId,
	recipient: chat.phoneNumber ? String(chat.phoneNumber) : chat.chatId,
	name: chat.name,
	messages: [],
});
