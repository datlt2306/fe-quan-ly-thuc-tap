import Button from "@/Core/components/common/Button";

import React, { forwardRef, useRef } from "react";
import tw from "twin.macro";
import { excelSampleData } from "../mocks";
import { useExportToExcel } from "@/App/hooks/useExcel";
import { ArrowDownTrayIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";

const DesktopButtonGroup = ({ tableData, handleImport, handleExport }, ref) => {
	const localRef = useRef(null);
	const fileInputRef = ref || localRef;
	const { handleExportFile } = useExportToExcel();

	return (
		<ButtonList>
			<Button as="label" size="sm" htmlFor="file-input" variant="primary">
				<DocumentArrowUpIcon className="h-6 w-6 text-[inherit]" /> Tải lên file Excel
				<input
					ref={fileInputRef}
					type="file"
					id="file-input"
					className="hidden"
					onChange={(e) => {
						handleImport(e.target.files[0]);
					}}
				/>
			</Button>
			<Button variant="success" size="sm" onClick={() => handleExport(tableData)}>
				<DocumentArrowDownIcon className="h-6 w-6 text-[inherit]" />
				Export file Excel
			</Button>
			<Button variant="secondary" size="sm" onClick={() => handleExportFile(excelSampleData)}>
				<ArrowDownTrayIcon className="h-6 w-6 text-[inherit]" />
				Tải file mẫu
			</Button>
		</ButtonList>
	);
};

const ButtonList = tw.div`flex items-center gap-2 sm:hidden md:hidden`;

export default forwardRef(DesktopButtonGroup);
