export const msToTime = (ms: number) => {
	const seconds = (ms / 1000).toFixed(1);
	const minutes = (ms / (1000 * 60)).toFixed(1);
	const hours = (ms / (1000 * 60 * 60)).toFixed(1);
	const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
	if (parseFloat(seconds) < 60) return seconds + ' segundos';
	else if (parseFloat(minutes) < 60) return minutes + ' minutos';
	else if (parseFloat(hours) < 24) return hours + ' horas';
	else return days + ' dias';
};
