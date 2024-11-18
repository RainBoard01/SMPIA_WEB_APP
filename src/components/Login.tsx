import {
	Paper,
	TextInput,
	PasswordInput,
	Checkbox,
	Button,
	Title,
	Text,
	Anchor,
} from '@mantine/core';
import classes from './Login.module.css';
import { useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetchToAPI from '../lib/fetch';

export function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { auth, setAuth } = useAuth();
	const userRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const from = (location.state as LocationState)?.from?.pathname || '/';

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

	const { data: user } = useQuery({
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
		<div className={classes.wrapper}>
			<Paper className={classes.form} radius={0} p={30}>
				<Title
					order={2}
					className={classes.title}
					ta='center'
					mt='md'
					mb={50}
				>
					Welcome back to Mantine!
				</Title>
				<form
					onSubmit={e => {
						e.preventDefault();
						login.mutate();
					}}
				>
					<TextInput
						label='Username'
						placeholder='username'
						size='md'
						onChange={event => setUsername(event.target.value)}
						value={username}
						ref={userRef}
					/>
					<PasswordInput
						label='Password'
						placeholder='Your password'
						onChange={event => setPassword(event.target.value)}
						value={password}
						mt='md'
						size='md'
					/>
					<Checkbox label='Keep me logged in' mt='xl' size='md' />
					<Button type='submit' fullWidth mt='xl' size='md'>
						Login
					</Button>
				</form>
				<Text ta='center' mt='md'>
					Don&apos;t have an account?{' '}
					<Anchor<'a'>
						href='#'
						fw={700}
						onClick={event => event.preventDefault()}
					>
						Register
					</Anchor>
				</Text>
			</Paper>
		</div>
	);
}
