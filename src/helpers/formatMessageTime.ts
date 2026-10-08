export const formatMessageTime = (timestamp: number): string => {
	return new Date(timestamp).toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	});
};
