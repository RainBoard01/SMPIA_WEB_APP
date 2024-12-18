import { useMutation } from '@tanstack/react-query';
import useAuth from './useAuth';
import fetchToAPI from '../lib/fetch';
import { MetadataType } from '../routes/Home';

export type AnalisisType = {
	id: number;
	createdAt: string;
	nombre: string;
	clase_predominante: string;
	porcentaje_confianza: number;
	modelo: string;
	nombre_archivo: string;
	nombre_modelo: string;
	magnitudes: {
		min: number;
		max: number;
		promedio: number;
		delta: number;
	};
	clases_detectadas: {
		clase: string;
		porcentaje: number;
	}[];
	metadata: MetadataType;
};

export const useSaveResults = () => {
	const { auth } = useAuth();
	return useMutation({
		mutationFn: async (data: object): Promise<AnalisisType> =>
			fetchToAPI(
				'POST',
				'/analisises',
				{
					accept: 'application/json',
					Authorization: `Bearer ${auth.jwt}`,
					'Content-Type': 'application/json',
				},
				JSON.stringify(data)
			),
	});
};
