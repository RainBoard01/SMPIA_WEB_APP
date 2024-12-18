import { DonutChart, PieChart } from '@mantine/charts';
import {
	Box,
	Button,
	ColorSwatch,
	Container,
	Divider,
	Grid,
	Group,
	SimpleGrid,
	Stack,
	Table,
	Text,
	TextInput,
	Title,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { filesize } from 'filesize';
import { msToTime } from '../lib/msToTime';
import { getRelativeTime } from '../lib/relativeTime';
import { ResultsType } from '../hooks/useUploadFiles';
import { MetadataType } from '../routes/Home';
import { useSaveResults } from '../hooks/useSaveResults';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { modals } from '@mantine/modals';
import { useQueryClient } from '@tanstack/react-query';

export const ResultContainer = (props: {
	color: string;
	title: string;
	data: string;
	rip?: boolean;
}) => {
	const { color, title, data, rip } = props;
	const { colorScheme } = useMantineColorScheme();
	return (
		<Container
			style={{
				width: '100%',
				borderRadius: 8,
				padding: 24,
			}}
			bg={`${color}.${colorScheme === 'dark' ? 9 : 1}`}
		>
			<Title
				fw={500}
				order={4}
				c={`${rip ? 'red' : color}.${
					rip ? 9 : colorScheme === 'dark' ? 0 : 9
				}`}
			>
				{title}
			</Title>
			<Title
				order={1}
				c={`${rip ? 'red' : color}.${
					rip ? 7 : colorScheme === 'dark' ? 3 : 7
				}`}
			>
				{data}
			</Title>
		</Container>
	);
};

export const Results = (props: {
	data: ResultsType;
	metadata: MetadataType | undefined;
	isHistorial?: boolean;
}) => {
	const { data, metadata, isHistorial } = props;
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const queryClient = useQueryClient();

	const {
		mutate: saveResult,
		data: savedData,
		isSuccess,
		isPending,
	} = useSaveResults();

	const calculateColor = (percentage: number) => {
		if (percentage > 100) return 'dark';
		if (percentage > 50) return 'red';
		if (percentage > 10) return 'yellow';
		return 'green';
	};

	useEffect(() => {
		if (isSuccess && savedData) {
			notifications.show({
				title: 'Análisis guardado',
				message: 'El análisis fue guardado exitosamente',
				color: 'green',
			});
			queryClient.invalidateQueries({
				queryKey: ['analisis'],
			});
		}
	}, [savedData, isSuccess, queryClient]);

	const handleSaveResults = () => {
		modals.open({
			title: 'Ingrese el nombre del análisis',
			children: (
				<>
					<TextInput
						id='nombre'
						label='Nombre Medición'
						placeholder='Motor 1'
						data-autofocus
					/>

					<Button
						fullWidth
						onClick={async () => {
							try {
								saveResult({
									data: {
										// @ts-expect-error value IS a valid property
										nombre: document.getElementById('nombre')?.value,
										clase_predominante: data.clase_predominante,
										clases_detectadas: data.clases_detectadas,
										magnitudes: data.magnitudes,
										porcentaje_confianza: data.porcentaje_confianza,
										nombre_archivo: data.archivo,
										nombre_modelo: data.modelo,
										metadata,
										modelo: {
											id: 1,
										},
									},
								});
							} catch (error) {
								notifications.show({
									title: 'Error al guardar',
									message: 'Ocurrió un error al guardar el análisis',
									color: 'red',
								});
							} finally {
								modals.closeAll();
							}
						}}
						mt='md'
					>
						Guardar
					</Button>
				</>
			),
		});
	};

	return (
		<Stack w='100%' gap='lg'>
			<Group justify='space-between'>
				{!isHistorial ? (
					<Title order={2}>Reporte de Análisis del archivo</Title>
				) : null}
				{!isHistorial ? (
					<Button
						color='green.7'
						onClick={handleSaveResults}
						leftSection={<IconDeviceFloppy />}
						loading={isPending}
					>
						Guardar Análisis
					</Button>
				) : null}
			</Group>
			<SimpleGrid cols={{ base: 1, sm: 3 }} spacing='lg'>
				<ResultContainer
					color={
						data.clase_predominante.startsWith('bal') ? 'green' : 'yellow'
					}
					title='Estado'
					data={
						data.clase_predominante.startsWith('bal')
							? 'Balanceado'
							: 'Desbalanceado'
					}
				/>
				<ResultContainer
					color='blue'
					title='Confianza'
					data={`${parseFloat(data.porcentaje_confianza.toFixed(3))}%`}
				/>
				<ResultContainer
					rip={data.magnitudes.max > 100}
					color={calculateColor(data.magnitudes.max)}
					title='Grado Desbalance'
					data={`${parseFloat(data.magnitudes.max.toFixed(2))}%${
						data.magnitudes.max > 100 ? '💀' : ''
					}`}
				/>
			</SimpleGrid>
			<Grid>
				<Grid.Col
					span='content'
					style={{
						marginRight: 8,
						borderRight: `1px solid ${
							colorScheme === 'dark'
								? theme.colors.dark[5]
								: theme.colors.gray[3]
						}`,
						paddingRight: 16,
					}}
				>
					<Stack gap='xs'>
						<Title order={5}>Distribución de desbalanceo</Title>
						<Box
							w={300}
							h={300}
							p=''
							bg={
								colorScheme === 'dark'
									? theme.colors.dark[5]
									: theme.colors.gray[0]
							}
							style={{
								borderRadius: 8,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<DonutChart
								w='100%'
								h='100%'
								size={220}
								thickness={40}
								styles={{
									label: {
										color:
											colorScheme === 'dark'
												? theme.colors.gray[0]
												: theme.colors.dark[9],
									},
								}}
								withTooltip={false}
								strokeColor={
									colorScheme === 'dark'
										? theme.colors.gray[7]
										: theme.colors.dark[3]
								}
								startAngle={-180 - 45 - 22.5}
								chartLabel={
									data.clase_predominante.split('_')[1] || 'Balanceado'
								}
								data={[8, 7, 6, 5, 4, 3, 2, 1].map(peso => ({
									name: `${peso}`,
									value: 125,
									color: data.clase_predominante
										.split('_')[1]
										?.split('+')
										.includes(`${peso}`)
										? theme.colors[theme.primaryColor][5]
										: colorScheme === 'dark'
										? theme.colors.dark[6]
										: theme.colors.gray[4],
								}))}
							/>
						</Box>
					</Stack>
				</Grid.Col>
				<Grid.Col span='content'>
					<Stack gap='xs'>
						<Title order={5}>Detalle de detecciones</Title>
						<Table highlightOnHover striped>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>ESTADO</Table.Th>
									<Table.Th>TIPO</Table.Th>
									<Table.Th>COLOR</Table.Th>
									<Table.Th>PROB.</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{data.clases_detectadas
									.sort((a, b) => b.porcentaje - a.porcentaje)
									.map((el, i) => (
										<Table.Tr key={i}>
											<Table.Td>
												{el.clase.startsWith('bal')
													? 'Balanceado'
													: 'Desbalanceado'}
											</Table.Td>
											<Table.Td>
												{el.clase.startsWith('bal')
													? '-'
													: el.clase.split('_')[1]}
											</Table.Td>
											<Table.Td>
												<ColorSwatch
													color={
														theme.colors[
															i === 0
																? theme.primaryColor
																: Object.keys(theme.colors)[
																		i < 7 ? i + 7 : i - 5
																  ]
														][5]
													}
												/>
											</Table.Td>
											<Table.Td>{`${parseFloat(
												el.porcentaje.toFixed(3)
											)}%`}</Table.Td>
										</Table.Tr>
									))}
							</Table.Tbody>
						</Table>
						<Box
							w={300}
							h={300}
							bg={
								colorScheme === 'dark'
									? theme.colors.dark[5]
									: theme.colors.gray[0]
							}
							style={{
								borderRadius: 8,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<PieChart
								w={'100%'}
								h={'100%'}
								// size={150}
								withLabelsLine
								labelsPosition='outside'
								labelsType='percent'
								withLabels
								data={data.clases_detectadas
									.sort((a, b) => b.porcentaje - a.porcentaje)
									.map((el, i) => ({
										color: theme.colors[
											i === 0
												? theme.primaryColor
												: Object.keys(theme.colors)[
														i < 7 ? i + 7 : i - 5
												  ]
										][5],
										value: el.porcentaje,
										name: el.clase,
									}))}
							/>
						</Box>
					</Stack>
				</Grid.Col>
				<Grid.Col span='auto'>
					<Stack gap='xs'>
						<Title order={5}>Metadata</Title>
						<Stack gap='xs' mb='sm'>
							<Title td='underline' order={6}>
								Datos del archivo
							</Title>
							<Stack gap={0}>
								<Group>
									<Title fw={500} w={160} order={6}>
										Nombre:
									</Title>
									<Divider orientation='vertical' />
									<Text>{metadata?.filename}</Text>
								</Group>
								<Group>
									<Title fw={500} w={160} order={6}>
										Tamaño:
									</Title>
									<Divider orientation='vertical' />
									<Text>{filesize(metadata?.size || 0)}</Text>
								</Group>
								<Group>
									<Title fw={500} w={160} order={6}>
										Última modificación:
									</Title>
									<Divider orientation='vertical' />
									<Text>
										{metadata?.last_modified
											? getRelativeTime(metadata.last_modified)
											: '-'}
									</Text>
								</Group>
							</Stack>
						</Stack>
						<Stack gap='xs' mb='sm'>
							<Title td='underline' order={6}>
								Datos de entrada
							</Title>
							<Stack gap={0}>
								<Group>
									<Title fw={500} w={160} order={6}>
										Cantidad de datos:
									</Title>
									<Divider orientation='vertical' />
									<Text>{metadata?.total_rows}</Text>
								</Group>
								<Group>
									<Title fw={500} w={160} order={6}>
										Tiempo total medición:
									</Title>
									<Divider orientation='vertical' />
									<Text>{msToTime(metadata?.total_time || 0)}</Text>
								</Group>
							</Stack>
						</Stack>
						<Stack gap='xs'>
							<Title td='underline' order={6}>
								Datos de analisis
							</Title>
							<Stack gap={0}>
								<Group>
									<Title fw={500} w={160} order={6}>
										Tiempo de análisis:
									</Title>
									<Divider orientation='vertical' />
									<Text>{`${metadata?.time_elapsed} milisegundos`}</Text>
								</Group>
								<Group>
									<Title fw={500} w={160} order={6}>
										Predicción:
									</Title>
									<Divider orientation='vertical' />
									<Text>{data.clase_predominante}</Text>
								</Group>
								<Group>
									<Title fw={500} w={160} order={6}>
										Modelo utilizado:
									</Title>
									<Divider orientation='vertical' />
									<Text>{data.modelo?.split('/')[1]}</Text>
								</Group>
							</Stack>
						</Stack>
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};
