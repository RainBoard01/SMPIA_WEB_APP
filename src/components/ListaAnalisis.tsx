import {
	Card,
	Stack,
	Group,
	Title,
	Button,
	Table,
	Badge,
	useMantineTheme,
} from '@mantine/core';
import { useGetAnalisis } from '../hooks/useGetAnalisis';
import { AnalisisType } from '../hooks/useSaveResults';
import { modals } from '@mantine/modals';
import { Results } from './Results';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';

export const ListaAnalisis = () => {
	const theme = useMantineTheme();
	const queryClient = useQueryClient();

	const { data: analisis } = useGetAnalisis({
		sort: 'createdAt:desc',
		pagination: {
			pageSize: 1000,
		},
	});

	return (
		<Card radius='md' maw='72rem' w='100%' shadow='md' padding={24} mb='lg'>
			<Stack w='100%' gap='lg'>
				<Group justify='space-between'>
					<Title order={2}>Historial de Análisis</Title>
				</Group>
				<Table highlightOnHover striped>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>FECHA Y HORA</Table.Th>
							<Table.Th>NOMBRE MEDICION</Table.Th>
							<Table.Th>PREDICCION</Table.Th>
							<Table.Th>DESBALANCEO</Table.Th>
							<Table.Th>ACCIONES</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{analisis?.data.length ? (
							analisis?.data.map((item: AnalisisType) => (
								<Table.Tr key={item.id}>
									<Table.Td>
										{item.createdAt
											? Intl.DateTimeFormat('fr-FR', {
													year: 'numeric',
													month: 'numeric',
													day: 'numeric',
													hour: 'numeric',
													minute: 'numeric',
											  }).format(new Date(item.createdAt))
											: 'Sin fecha'}
									</Table.Td>
									<Table.Td>{item.nombre}</Table.Td>
									<Table.Td>
										<Badge
											color={
												item.clase_predominante.startsWith('bal')
													? 'green'
													: 'yellow'
											}
										>
											{item.clase_predominante.startsWith('bal')
												? 'Balanceado'
												: 'Desbalanceado'}
										</Badge>
									</Table.Td>
									<Table.Td>{`${parseFloat(
										item.magnitudes.max.toFixed(2)
									)}%${
										item.magnitudes.max > 100 ? '💀' : ''
									}`}</Table.Td>
									<Table.Td>
										<Button
											size='xs'
											variant='outline'
											color={theme.colors[theme.primaryColor][5]}
											onClick={() => {
												modals.open({
													title: (
														<Title
															order={2}
														>{`Reporte de Análisis: ${item.nombre}`}</Title>
													),
													size: '72rem',
													children: (
														<QueryClientProvider
															client={queryClient}
														>
															<Results
																data={{
																	...item,
																	archivo: item.nombre_archivo,
																	modelo: item.nombre_modelo,
																}}
																metadata={item.metadata}
																isHistorial
															/>
														</QueryClientProvider>
													),
												});
											}}
										>
											Ver Informe
										</Button>
									</Table.Td>
								</Table.Tr>
							))
						) : (
							<Table.Tr>
								<Table.Td colSpan={5}>
									No hay mediciones disponibles
								</Table.Td>
							</Table.Tr>
						)}
					</Table.Tbody>
				</Table>
			</Stack>
		</Card>
	);
};
