import { useMutation } from '@tanstack/react-query';
import useAuth from './useAuth';
import fetchToAPI from '../lib/fetch';

export type ResultsType = {
	archivo: string;
	clase_predominante: string;
	porcentaje_confianza: number;
	modelo: string;
	clases_detectadas: {
		clase: string;
		porcentaje: number;
	}[];
};

export const useUploadFiles = () => {
	const { auth } = useAuth();
	return useMutation({
		mutationFn: async (data: FormData): Promise<ResultsType> =>
			fetchToAPI(
				'POST',
				'/predecir',
				{
					accept: 'application/json',
					Authorization: `Bearer ${auth.jwt}`,
				},
				data
			),
	});
};
