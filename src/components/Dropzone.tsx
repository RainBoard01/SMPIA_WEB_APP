import { useEffect, useState } from 'react';
import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, MIME_TYPES } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';
import fetchToAPI from '../lib/fetch';
import useAuth from '../hooks/useAuth';

export function DropzoneCSV(props: Partial<DropzoneProps>) {
	const [files, setFiles] = useState<File[]>([]);
	const { auth } = useAuth();

	const sendFiles = useMutation({
		mutationFn: async data =>
			fetchToAPI(
				'POST',
				'/predecir',
				{
					accept: 'application/json',
					// 'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${auth.jwt}`,
				},
				data
			),
	});

	useEffect(() => {
		if (files.length > 0) {
			const formData = new FormData();
			files.forEach(file => formData.append('files', file));

			sendFiles.mutate(formData);
		}
	}, [files]);

	return (
		<Dropzone
			onDrop={files => setFiles(files)}
			onReject={files => console.log('rejected files', files)}
			maxSize={5 * 1024 ** 2}
			maxFiles={5}
			accept={[MIME_TYPES.csv]}
			{...props}
		>
			<Group
				justify='center'
				gap='xl'
				mih={220}
				style={{ pointerEvents: 'none' }}
			>
				<Dropzone.Accept>
					<IconUpload
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
					<IconPhoto
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-dimmed)',
						}}
						stroke={1.5}
					/>
				</Dropzone.Idle>

				<div>
					<Text size='xl' inline>
						Drag images here or click to select files
					</Text>
					<Text size='sm' c='dimmed' inline mt={7}>
						Attach as many files as you like, each file should not exceed
						5mb
					</Text>
				</div>
			</Group>
		</Dropzone>
	);
}
