import { useState } from 'react';
import {
	Container,
	Group,
	Burger,
	Title,
	useMantineTheme,
	ActionIcon,
	useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Header.module.css';
import useAuth from '../hooks/useAuth';
import { IconMoon, IconSun, IconWaveSawTool } from '@tabler/icons-react';

const links = [
	{ link: '/about', label: 'Analizar' },
	{ link: '/pricing', label: 'Modelos' },
	{ link: '/learn', label: 'Mi Perfil' },
	{ link: '/logout', label: 'Salir' },
];

export function Header() {
	const [opened, { toggle }] = useDisclosure(false);
	const [active, setActive] = useState(links[0].link);
	const auth = useAuth();
	const theme = useMantineTheme();
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	const items = links.map(link => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			data-active={active === link.link || undefined}
			onClick={event => {
				event.preventDefault();
				setActive(link.link);
				if (link.link === '/logout') {
					auth.logout();
				}
			}}
		>
			{link.label}
		</a>
	));

	return (
		<header className={classes.header}>
			<Container size='md' className={classes.inner}>
				<Group gap='xs'>
					<IconWaveSawTool
						color={theme.colors[theme.primaryColor][6]}
						size={32}
					/>
					<Title c={theme.colors[theme.primaryColor][6]} order={3}>
						VibraSense AI
					</Title>
				</Group>
				<Group gap={5} visibleFrom='xs'>
					{items}
					{
						<ActionIcon
							variant='outline'
							onClick={() =>
								setColorScheme(
									colorScheme === 'dark' ? 'light' : 'dark'
								)
							}
						>
							{colorScheme === 'dark' ? (
								<IconSun size={18} stroke={1.5} />
							) : (
								<IconMoon size={18} stroke={1.5} />
							)}
						</ActionIcon>
					}
				</Group>

				<Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom='xs'
					size='sm'
				/>
			</Container>
		</header>
	);
}
