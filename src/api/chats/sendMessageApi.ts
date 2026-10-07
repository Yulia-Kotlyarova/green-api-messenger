import { request } from '@/api/request';
import type { AuthCredentials } from '@/context/AuthContext';

interface SendMessageParams extends AuthCredentials {
	chatId: string;
	message: string;
}

interface SendMessageResponse {
	idMessage: string;
}

export const sendMessageApi = ({
	idInstance,
	apiTokenInstance,
	chatId,
	message,
}: SendMessageParams) => {
	console.log('message,', message);
	return request<SendMessageResponse>(
		`/green-api/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
		{
			method: 'POST',
			body: {
				chatId,
				message,
			},
		},
	);
};
