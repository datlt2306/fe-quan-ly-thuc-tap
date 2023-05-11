import { AllowedFileExt } from "@/Core/constants/allowedFileType";
import { mapExcelData } from "@/Core/utils/excelDataHandler";
import { useState } from "react";

import * as XLSX from "xlsx";

/**
 * @returns {[(file: File, callback: (data) => void) => void, {isLoading: boolean, isError: boolean}]}
 */
export const useImportFromExcel = () => {
	const [importState, setImportState] = useState({
		isLoading: false,
		isError: false,
	});

	/**
	 *
	 * @param {File} file
	 * @param {(data: Array<{[key:string]: any}>) => void} callback
	 */
	const handleImportFile = (file, callback) => {
		try {
			setImportState({ isLoading: true, isError: false });
			const reader = new FileReader();
			reader.onload = (e) => {
				/* Mapping data */
				const workbook = XLSX.read(e.target.result, { type: "binary" });
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];
				const importedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
				const filteredData = importedData.filter((row) => !!row.length);

				const mappedSheetData = mapExcelData(filteredData);
				/* Excute callback after importing file */
				if (callback instanceof Function) {
					callback(mappedSheetData);
				}
			};

			reader.readAsBinaryString(file);
			setImportState({ isLoading: false, isError: false });
		} catch (error) {
			setImportState({ isLoading: false, isError: true });
		}
	};

	return [handleImportFile, importState];
};

export const useExportToExcel = () => {
	const [error, setError] = useState(null);

	const handleExportFile = ({ fileName, data }) => {
		try {
			const worksheet = XLSX.utils.aoa_to_sheet(data);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "SheetJS");
			/* Generate XLSX file and send to client */
			return XLSX.writeFile(workbook, fileName + AllowedFileExt.XLSX);
		} catch (error) {
			console.log(error);
			setError(error.message);
		}
	};
	return { handleExportFile, error };
};
