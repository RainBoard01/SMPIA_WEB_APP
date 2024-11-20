import {
	AppShell,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { Header } from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function Root() {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	return (
		<AppShell
			style={{
				backgroundColor:
					colorScheme === 'dark'
						? theme.colors.dark[8]
						: theme.colors.gray[2],
			}}
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
