import { request } from '@/api/request';

export interface GetChatHistoryResponseItem {
	type: 'incoming' | 'outgoing';
	idMessage: string;
	timestamp: number;
	textMessage?: string;
}

interface GetChatHistoryParams {
	idInstance: string;
	apiTokenInstance: string;
	chatId: string;
	count?: number;
}

export const getChatHistory = ({
	idInstance,
	apiTokenInstance,
	chatId,
	count = 100,
}: GetChatHistoryParams) => {
	console.log('getChatHistory');
	return request<GetChatHistoryResponseItem[]>(
		`/green-api/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
		{
			method: 'POST',
			body: {
				// chat_id: chatId,
				chatId,
				count,
			},
		},
	);
};
