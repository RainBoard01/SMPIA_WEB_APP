import React, { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

export interface AuthContextType {
	auth: {
		jwt: string;
		user: {
			id: number;
			username: string;
			firstName: string | null;
			lastName: string | null;
			email: string;
			provider: string;
			confirmed: boolean;
			blocked: boolean;
			createdAt: string;
			updatedAt: string;
			role: {
				id: number;
				name: string;
				description: string;
				type: string;
				createdAt: string;
				updatedAt: string;
			};
		};
	};
	setAuth: (val: {} | ((prevState: {}) => {})) => void;
	logout: () => void;
}

const useAuth = () => useContext(AuthContext) as AuthContextType;

export default useAuth;
