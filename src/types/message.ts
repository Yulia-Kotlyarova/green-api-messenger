export type MessageDirection = 'incoming' | 'outgoing';

export interface MessageI {
	id: string;
	text: string;
	direction: MessageDirection;
	createdAt: number;
}
