export default function mapExcelData(data) {
	const keys = data[0];
	const mappedExcelData = data.slice(1).map((array, index) =>
		array.reduce((object, value, i) => {
			object[keys[i]] = value;
			return object;
		}, {})
	);
	return mappedExcelData;
}
