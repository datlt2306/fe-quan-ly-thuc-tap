function capitalizeString(str) {
	return str.replace(/(?:^|\s)\S/g, function (char) {
		return char.toUpperCase();
	});
}
export default capitalizeString;
