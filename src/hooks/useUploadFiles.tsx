import { useMutation } from '@tanstack/react-query';
import useAuth from './useAuth';
import fetchToAPI from '../lib/fetch';

export const useUploadFiles = () => {
	const { auth } = useAuth();
	return useMutation({
		mutationFn: async data =>
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
