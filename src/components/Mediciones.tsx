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

export const Mediciones = () => {
	const theme = useMantineTheme();
	return (
		<Card radius='md' maw='72rem' w='100%' shadow='md' padding={24} mb='lg'>
			<Stack w='100%' gap='lg'>
				<Group justify='space-between'>
					<Title order={2}>Historial de mediciones</Title>
				</Group>
				<Table highlightOnHover striped>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>FECHA</Table.Th>
							<Table.Th>NOMBRE MEDICION</Table.Th>
							<Table.Th>PREDICCION</Table.Th>
							<Table.Th>PROBABILIDAD.</Table.Th>
							<Table.Th>ACCIONES</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td>01/01/2021</Table.Td>
							<Table.Td>no_disponible</Table.Td>
							<Table.Td>
								<Badge color='green'>Balanceado</Badge>
							</Table.Td>
							<Table.Td>90%</Table.Td>
							<Table.Td>
								<Button
									size='xs'
									variant='outline'
									color={theme.colors[theme.primaryColor][5]}
								>
									Ver Informe
								</Button>
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
			</Stack>
		</Card>
	);
};
