import {
	Anchor,
	Button,
	Checkbox,
	Container,
	Group,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetchToAPI from '../lib/fetch';
import useAuth from '../hooks/useAuth';
import { IconWaveSawTool } from '@tabler/icons-react';

export function Login() {
	const theme = useMantineTheme();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { auth, setAuth } = useAuth();
	const userRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';

	const login = useMutation({
		mutationFn: async () =>
			await fetchToAPI(
				'POST',
				'/auth/local',
				{
					accept: 'application/json',
					'Content-Type': 'application/json',
				},
				JSON.stringify({ identifier: username, password })
			),
		onSuccess: data => {
			setAuth({ jwt: data?.jwt });
			setUsername('');
			setPassword('');
		},
		onError: () => {
			setUsername('');
			setPassword('');
		},
	});

	const { data: user, isFetching } = useQuery({
		queryKey: ['user'],
		queryFn: async () =>
			await fetchToAPI(
				'GET',
				'/users/me',
				{
					accept: 'application/json',
					Authorization: `Bearer ${auth.jwt}`,
				},
				undefined
			),
		enabled: login.isSuccess,
	});

	useEffect(() => {
		if (user) {
			setAuth({ ...auth, user: user });
			navigate(from, { replace: true });
		}
	}, [user]);

	useEffect(() => {
		const node = userRef.current;
		node?.focus();
	}, []);
	return (
		<Container size={420} my={40}>
			<Group
				style={{
					paddingLeft: '10%',
				}}
			>
				<IconWaveSawTool
					color={theme.colors[theme.primaryColor][6]}
					size={50}
				/>
				<Title c={theme.colors[theme.primaryColor][6]} order={1}>
					VibraSense AI
				</Title>
			</Group>
			<Text c='dimmed' size='sm' ta='center' mt={5}>
				¿No tienes una cuenta?{' '}
				<Anchor size='sm' component='button'>
					Crear cuenta
				</Anchor>
			</Text>

			<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
				<form
					onSubmit={e => {
						e.preventDefault();
						login.mutate();
					}}
				>
					<TextInput
						label='Nombre de usuario'
						placeholder='pepito'
						required
						onChange={event => setUsername(event.target.value)}
						value={username}
						ref={userRef}
					/>
					<PasswordInput
						label='Contraseña'
						placeholder='contraseñaMuySegura123'
						required
						mt='md'
						onChange={event => setPassword(event.target.value)}
						value={password}
					/>
					<Group justify='space-between' mt='lg'>
						<Checkbox label='Recordarme' />
						<Anchor component='button' size='sm'>
							Olvidaste tu contraseña?
						</Anchor>
					</Group>
					<Button
						loading={login.isPending || isFetching}
						fullWidth
						mt='xl'
						type='submit'
					>
						Ingresar
					</Button>
				</form>
			</Paper>
		</Container>
	);
}
