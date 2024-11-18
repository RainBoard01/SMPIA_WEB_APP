import { useLocalStorage } from '@mantine/hooks';
import { createContext, useState, ReactNode, useEffect } from 'react';

const AuthContext = createContext({});

interface Props {
	children?: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
	const [auth, setAuth] = useLocalStorage({
		key: 'auth',
		defaultValue: {},
	});

	const logout = () => {
		window.localStorage.removeItem('auth');
		setAuth({});
	};

	return (
		<AuthContext.Provider value={{ auth, setAuth, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
