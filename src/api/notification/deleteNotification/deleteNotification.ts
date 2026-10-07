import { request } from '@/api/request';

interface DeleteNotificationParams {
	idInstance: string;
	apiTokenInstance: string;
	receiptId: number;
}

interface DeleteNotificationResponse {
	result: boolean;
}

export const deleteNotificationApi = ({
	idInstance,
	apiTokenInstance,
	receiptId,
}: DeleteNotificationParams) => {
	return request<DeleteNotificationResponse>(
		`/green-api/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
		{
			method: 'DELETE',
		},
	);
};
