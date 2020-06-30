function leadingZero(n: number) {
	return n >= 10 ? n : "0" + n;
}

export const formatDate = (ts: number) => {
	let date = new Date(ts);
	let year = date.getFullYear();
	let month = leadingZero(date.getMonth() + 1);
	let day = leadingZero(date.getDate());
	let hours = leadingZero(date.getHours());
	let minutes = leadingZero(date.getMinutes());
	return day + "/" + month + "/" + year + " " + hours + ":" + minutes
}

export const parseInputDateTime = (s: string) => {
	return new Date(s).getTime()
}

export const formatInputDateTime = (n: number) => {
	return new Date(n).toISOString().slice(0, -8) // remove millisecond and second
}