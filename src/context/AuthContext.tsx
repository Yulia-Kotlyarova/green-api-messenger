import { createContext, useContext, useState, type PropsWithChildren } from 'react';

export interface AuthCredentials {
	idInstance: string;
	apiTokenInstance: string;
}

interface AuthContextValue {
	credentials: AuthCredentials | null;
	login: (credentials: AuthCredentials) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [credentials, setCredentials] = useState<AuthCredentials | null>(null);

	const login = (credentials: AuthCredentials) => {
		setCredentials(credentials);
	};

	const logout = () => {
		setCredentials(null);
	};

	return (
		<AuthContext.Provider
			value={{
				credentials,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}

	return context;
};
