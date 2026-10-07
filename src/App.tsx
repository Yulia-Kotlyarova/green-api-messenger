import { LoginPage } from '@/pages/LoginPage/LoginPage.tsx';
import { ChatPage } from '@/pages/ChatPage/ChatPage.tsx';
import { useAuth } from '@/context/AuthContext.tsx';

export const App = () => {
	const { credentials } = useAuth();

	return credentials ? <ChatPage /> : <LoginPage />;
};

export default App;
