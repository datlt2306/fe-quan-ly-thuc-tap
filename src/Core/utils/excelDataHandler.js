export const mapExcelData = (data) => {
	const keys = data[0];
	const mappedExcelData = data.slice(1).map((array, index) =>
		array.reduce((object, value, i) => {
			object[keys[i]] = value;
			return object;
		}, {})
	);
	return mappedExcelData;
};

export const convertToExcelData = ({ data, columnKeysAccessor }) => {
	const columnNames = Object.values(columnKeysAccessor);
	const filteredData = data.map((item) => {
		const filteredItem = {};
		columnNames.forEach((columnName) => {
			const key = Object.keys(columnKeysAccessor).find((k) => columnKeysAccessor[k] === columnName);
			filteredItem[columnName] = item[key];
		});
		return filteredItem;
	});
	return filteredData;
};
