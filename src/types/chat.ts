import type { MessageI } from '@/types/message';

export interface ChatI {
	id: string;
	recipient: string;
	name: string;
	messages: MessageI[];
}
