import { Button, Card, Center, Progress, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { DropzoneCSV } from '../components/DropzoneCSV';
import { useUploadFiles } from '../hooks/useUploadFiles';
import { Results } from '../components/Results';
import { parse } from 'papaparse';
import { useInterval } from '@mantine/hooks';

export const Home = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [metadata, setMetadata] = useState<any>();
	const [msAnalisis, setMsAnalisis] = useState(0);
	const interval = useInterval(() => setMsAnalisis(s => s + 1), 1);

	const { mutate: sendFile, data: results, isPending } = useUploadFiles();

	const handleAnalizarDatos = () => {
		if (files.length > 0) {
			setMsAnalisis(0);
			const formData = new FormData();
			files.forEach(file => formData.append('file', file));
			interval.start();
			sendFile(formData);
		}
	};

	useEffect(() => {
		if (files.length && results) {
			interval.stop();
			const filename = files[0].name;
			const size = files[0].size;
			const last_modified = files[0].lastModified;
			const time_elapsed = msAnalisis;
			parse(files[0], {
				header: true,
				skipEmptyLines: true,
				complete: results => {
					setMetadata({
						filename,
						size,
						last_modified,
						time_elapsed,
						total_rows: results.data.length,
						total_time: results.data.length * 0.5,
					});
				},
			});
		}
	}, [files, results]);

	return (
		<Center>
			<Stack w='100%' gap='xl' align='center'>
				<DropzoneCSV
					loading={isPending}
					files={files}
					setFiles={setFiles}
					handleSubmit={handleAnalizarDatos}
				/>
				{isPending && (
					<Stack w='42rem' gap={0} align='center' mt='-44px'>
						<Progress
							w='100%'
							radius='md'
							size='lg'
							value={100}
							mb='md'
							striped
							animated
						/>
						<Text
							size='xl'
							fw={900}
							variant='gradient'
							gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
						>
							Analizando los datos...
						</Text>
						<Text size='xs' c='dimmed'>
							Por favor espere mientras el modelo analiza los datos
						</Text>
					</Stack>
				)}
				{results && <Results data={results} metadata={metadata} />}
			</Stack>
		</Center>
	);
};