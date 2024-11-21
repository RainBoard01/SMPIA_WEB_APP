import '@mantine/core/styles.css';
import {
	MantineProvider,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { theme } from './theme';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import { AuthProvider } from './context/AuthProvider';
import { Login } from './components/Login';
import { RequireAuth } from './components/RequireAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotFoundPage } from './components/NotFoundPage';
import { Home } from './routes/Home';

const queryClient = new QueryClient();

export default function App() {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<main
					style={{
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						minHeight: '100vh',
						backgroundColor:
							colorScheme === 'dark'
								? theme.colors.dark[8]
								: theme.colors.gray[2],
					}}
				>
					<Outlet />
				</main>
			),
			children: [
				// public routes
				{
					path: '/login',
					element: <Login />,
				},
				// protected routes
				{
					path: '/',
					element: <Root />,
					children: [
						{
							element: <RequireAuth allowedRoles={['authenticated']} />,
							children: [
								{
									path: '/',
									element: <Home />,
								},
							],
						},
					],
				},

				// 404
				{
					path: '*',
					element: <NotFoundPage />,
				},
			],
		},
	]);
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</QueryClientProvider>
	);
}
