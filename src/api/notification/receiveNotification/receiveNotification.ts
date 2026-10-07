import { request } from '@/api/request';

interface ReceiveNotificationParams {
	idInstance: string;
	apiTokenInstance: string;
}

interface ReceiveNotificationResponse {
	receiptId: number;
	body: {
		typeWebhook: string;
		timestamp: number;
		idMessage?: string;
		senderData?: {
			chatId: string;
			sender: string;
			senderName: string;
		};
		messageData?: {
			typeMessage: string;
			textMessageData?: {
				textMessage: string;
			};
		};
	};
}

export const receiveNotificationApi = ({
	idInstance,
	apiTokenInstance,
}: ReceiveNotificationParams) => {
	return request<ReceiveNotificationResponse | null>(
		`/green-api/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
	);
};
