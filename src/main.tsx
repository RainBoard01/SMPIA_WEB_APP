import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@mantine/dropzone/styles.css';
import { theme } from './theme.ts';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider theme={theme} defaultColorScheme='light'>
			<ModalsProvider>
				<Notifications />
				<App />
			</ModalsProvider>
		</MantineProvider>
	</React.StrictMode>
);
