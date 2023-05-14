import * as XLSX from "xlsx";
import { AllowedFileExt } from "../constants/allowedFileType";
import { toast } from "react-toastify";
import getFileExtension from "./getFileExtension";

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

export const convertToExcelData = (data, columnKeyMatchers) => {
	console.log(data);
	const columnNames = Object.values(columnKeyMatchers);

	const filteredData = data.map((item) => {
		const filteredItem = {};
		columnNames.forEach((columnName) => {
			const key = Object.keys(columnKeyMatchers).find((k) => columnKeyMatchers[k] === columnName);
			filteredItem[columnName] = item[key];
		});
		return filteredItem;
	});
	return [
		Object.keys(filteredData[0]),
		...filteredData.map((row) => {
			return Object.values(row);
		}),
	];
};
