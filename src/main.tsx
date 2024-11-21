import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@mantine/dropzone/styles.css';
import { theme } from './theme.ts';
import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider theme={theme} defaultColorScheme='light'>
			<App />
		</MantineProvider>
	</React.StrictMode>
);
