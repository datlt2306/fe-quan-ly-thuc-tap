import { AllowedFileExt } from "@/Core/constants/allowedFileType";
import mapExcelData from "@/Core/utils/mapExcelData";
import { useState } from "react";
import * as XLSX from "xlsx";

/**
 * @returns Import file handler and data from excel file
 */
export const useImportFromExcel = () => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const handleGetFile = (file) => {
		/* Boilerplate to set up FileReader */
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			try {
				/* chuyển đổi data*/
				const bstr = e?.target && e.target.result;
				const workbook = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
				/* lấy all sheet */
				let sheets = [];
				workbook.SheetNames.forEach((item) => {
					const worksheet = workbook.Sheets[item];
					/* Convert array of arrays */
					const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
					sheets = [...sheets, ...data.filter((row) => row.length > 0)];
				});

				setData(sheets);
				setError(null);
			} catch (error) {
				console.log(error);
				setData([]);
				setError({ message: error.message, success: false });
			}
		};
		if (rABS) reader.readAsBinaryString(file);
		else reader.readAsArrayBuffer(file);
	};

	return { handleGetFile, data, error };
};

/**
 * @param {string} fileName
 * @param {Array} data
 * @returns Excel file
 */
export const useExportToExcel = ({ fileName, data }) => {
	const handleExport = () => {
		try {
			/* convert state to workbook */
			data = data.map((row) => row.map((cellValue) => cellValue.toString()));
			const worksheet = XLSX.utils.aoa_to_sheet(data);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "SheetJS");
			/* generate XLSX file and send to client */
			return XLSX.writeFile(workbook, fileName + AllowedFileExt.XLSX);
		} catch (error) {
			console.log(error.message);
		}
	};
	return handleExport;
};
