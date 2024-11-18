const handleErrors = (response: any) => {
	if (response.status === 401) window.localStorage.removeItem('auth');
	if (!response.ok) throw new Error(response.statusText);
	return response;
};

const fetchToAPI = async (
	method: string,
	route: string,
	headers: HeadersInit | undefined,
	body: BodyInit | undefined
) => {
	let baseURL: string =
		import.meta.env.VITE_API_URL || 'import.meta\u200b.env.VITE_API_URL';
	let response = await fetch(baseURL + route, {
		method,
		headers,
		body,
	})
		.then(handleErrors)
		.then(res => res.json())
		.catch(error => {
			throw error;
		});

	// console.log(body)
	return response;
};

export default fetchToAPI;
