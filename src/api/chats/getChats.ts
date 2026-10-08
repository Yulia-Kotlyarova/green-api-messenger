import { request } from '@/api/request';

export interface GetChatsResponseItem {
	chatId: string;
	name: string;
	type: 'user' | 'group' | 'channel' | 'bot';
	phoneNumber: number;
}

interface GetChatsParams {
	idInstance: string;
	apiTokenInstance: string;
}

export const getChats = ({ idInstance, apiTokenInstance }: GetChatsParams) => {
	return request<GetChatsResponseItem[]>(
		`/green-api/waInstance${idInstance}/getChats/${apiTokenInstance}`,
	);
};
