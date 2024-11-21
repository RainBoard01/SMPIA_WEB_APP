import {
	Anchor,
	Button,
	Card,
	Loader,
	Stack,
	Text,
	rem,
	useMantineTheme,
} from '@mantine/core';
import {
	IconUpload,
	IconX,
	IconFileTypeCsv,
	IconFileUpload,
} from '@tabler/icons-react';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import classes from './DropzoneCSV.module.css';
import { filesize } from 'filesize';

export function DropzoneCSV(props: {
	setFiles: (arg0: FileWithPath[]) => void;
	handleSubmit?: () => void;
	loading?: boolean;
	files?: File[];
}) {
	const theme = useMantineTheme();
	return (
		<Card radius='md' maw='42rem' w='100%' shadow='md' padding={24}>
			<Stack>
				<Dropzone
					className={props.loading ? classes.disabled : ''}
					onDrop={files => props.setFiles(files)}
					onReject={files => console.log('rejected files', files)}
					maxSize={10 * 1024 ** 2}
					maxFiles={1}
					disabled={props.loading}
					accept={[MIME_TYPES.csv]}
					styles={{
						root: {
							padding: '32px',
						},
					}}
				>
					<Stack gap={0} align='center' style={{ pointerEvents: 'none' }}>
						{props.loading ? (
							<Loader
								style={{
									height: rem(52),
								}}
								type='bars'
								color='gray.5'
							/>
						) : (
							<>
								<Dropzone.Accept>
									<IconFileTypeCsv
										style={{
											width: rem(52),
											height: rem(52),
											color: 'var(--mantine-color-blue-6)',
										}}
										stroke={1.5}
									/>
								</Dropzone.Accept>
								<Dropzone.Reject>
									<IconX
										style={{
											width: rem(52),
											height: rem(52),
											color: 'var(--mantine-color-red-6)',
										}}
										stroke={1.5}
									/>
								</Dropzone.Reject>
								<Dropzone.Idle>
									{props.files?.length ? (
										<IconFileUpload
											style={{
												width: rem(52),
												height: rem(52),
												color: theme.colors[theme.primaryColor][5],
											}}
											stroke={1.5}
										/>
									) : (
										<IconUpload
											style={{
												width: rem(52),
												height: rem(52),
												color: 'var(--mantine-color-dimmed)',
											}}
											stroke={1.5}
										/>
									)}
								</Dropzone.Idle>
							</>
						)}
						<Stack gap={0} align='center' mt='md'>
							<Text size='sm' fw={600}>
								{props?.files?.length
									? `${props?.files[0].name} (${filesize(
											props?.files[0].size
									  )})`
									: 'Arrastra tu archivo CSV o'}
							</Text>
							<Anchor size='md' target='_blank'>
								{props.files?.length ? `Cambiar` : 'Selecciona un'}{' '}
								archivo
							</Anchor>
						</Stack>
						<Text size='xs' c='dimmed' mt={8}>
							CSV hasta 10MB
						</Text>
					</Stack>
				</Dropzone>
				<Button
					disabled={props.loading || !props.files?.length}
					onClick={props.handleSubmit}
				>
					{!props.files?.length ? 'Primero seleccionar' : 'Analizar Datos'}
				</Button>
			</Stack>
		</Card>
	);
}
