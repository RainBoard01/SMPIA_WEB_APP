import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import fetchToAPI from '../lib/fetch';
import qs from 'qs';
import { AnalisisType } from './useSaveResults';

export const useGetAnalisis = (query: object) => {
	const { auth } = useAuth();

	return useQuery({
		queryKey: ['analisis'],
		queryFn: async (): Promise<{
			data: AnalisisType[];
			meta: {
				pagination: {
					page: number;
				};
			};
		}> =>
			fetchToAPI(
				'GET',
				`/analisises${query ? '?' : ''}${query ? qs.stringify(query) : ''}`,
				{
					accept: 'application/json',
					Authorization: `Bearer ${auth.jwt}`,
				},
				undefined
			),
	});
};
