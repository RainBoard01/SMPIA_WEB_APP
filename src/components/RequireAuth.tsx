import { LoadingOverlay } from '@mantine/core';
import { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const RequireAuth = ({
	allowedRoles,
}: {
	allowedRoles: Array<string>;
}): JSX.Element => {
	const { auth, setAuth } = useAuth();
	const location = useLocation();

	const local = JSON.parse(window.localStorage.getItem('auth') || '{}');
	const loading = local.user !== auth.user;

	useEffect(() => {
		if (!Object.keys(local).length) setAuth({});
	}, [local]);

	return allowedRoles.includes(auth?.user?.role.type) ? (
		<Outlet />
	) : auth?.user ? (
		<Navigate to='/unauthorized' state={{ from: location }} replace />
	) : loading ? (
		<LoadingOverlay opacity={1} visible={loading} />
	) : (
		<Navigate to='/login' state={{ from: location }} replace />
	);
};
