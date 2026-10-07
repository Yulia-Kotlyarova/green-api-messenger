import { request } from '@/api/request.ts';

interface CheckAccountParams {
	idInstance: string;
	apiTokenInstance: string;
	phoneNumber: string;
}

interface CheckAccountResponse {
	exist: boolean;
	chatId?: string;
	username?: string;
	phoneNumber?: number;
	fromCache?: boolean;
}

export const checkAccountApi = ({
	idInstance,
	apiTokenInstance,
	phoneNumber,
}: CheckAccountParams) => {
	return request<CheckAccountResponse>(
		`/green-api/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
		{
			method: 'POST',
			body: {
				phoneNumber: Number(phoneNumber),
			},
		},
	);
};
