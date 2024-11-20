import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
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

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<main>
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

export default function App() {
	return (
		<MantineProvider theme={theme} defaultColorScheme='light'>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</QueryClientProvider>
		</MantineProvider>
	);
}
