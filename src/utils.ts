export const formatDate = (ts: number) => {
	let date = new Date(ts);
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hours = date.getHours();
	let minutes = date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes();
	return day + "/" + month + "/" + year + " " + hours + ":" + minutes
}