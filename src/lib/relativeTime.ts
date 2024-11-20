// in miliseconds
let units: {
	[key: string]: number;
} = {
	year: 24 * 60 * 60 * 1000 * 365,
	month: (24 * 60 * 60 * 1000 * 365) / 12,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000,
	second: 1000,
};

let rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

export const getRelativeTime = (d1: number, d2 = new Date()) => {
	var elapsed = d1 - Number(d2);

	// "Math.abs" accounts for both "past" & "future" scenarios
	for (let u of Object.getOwnPropertyNames(units)) {
		if (Math.abs(elapsed) > units[u] || u == 'second')
			return rtf.format(
				Math.round(elapsed / units[u]),
				u as Intl.RelativeTimeFormatUnit
			);
	}
};
