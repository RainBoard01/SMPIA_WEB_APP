import { AppShell, useMantineTheme } from '@mantine/core';
import { Header } from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function Root() {
	return (
		<AppShell
			header={{
				height: '56px',
			}}
			padding='md'
		>
			<AppShell.Header>
				<Header />
			</AppShell.Header>
			<AppShell.Main maw='80rem' mx='auto'>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
