import Button from '@/Core/components/common/Button';
import React, { forwardRef, memo, useRef } from 'react';
import tw from 'twin.macro';
import { studentListSampleData } from '../mocks';
import { useExportToExcel } from '@/App/hooks/useExcel';
import { ArrowDownTrayIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import Box from '@/Core/components/common/Box';
import Tooltip from '@/Core/components/common/Tooltip';

const DesktopButtonGroup = forwardRef(({ tableData, handleImport, handleExport, canImport }, ref) => {
	const localRef = useRef(null);
	const fileInputRef = ref || localRef;
	const [handleExportFile] = useExportToExcel();

	return (
		<Box className='flex items-center gap-1 sm:hidden md:hidden'>
			<Button
				as='label'
				size='sm'
				htmlFor='file-input'
				variant={canImport ? 'primary' : 'disabled'}
				icon={DocumentArrowUpIcon}>
				Tải lên file Excel
				<input
					ref={fileInputRef}
					type='file'
					id='file-input'
					className='hidden'
					onChange={(e) => {
						handleImport(e.target.files[0]);
					}}
					disabled={!canImport}
				/>
			</Button>

			<Button
				variant='success'
				size='sm'
				onClick={() => handleExport(tableData)}
				icon={DocumentArrowDownIcon}
				text='Export file Excel'
			/>

			<Button
				variant='secondary'
				size='sm'
				onClick={() => handleExportFile(studentListSampleData)}
				icon={ArrowDownTrayIcon}
				text='Tải file mẫu'
			/>
		</Box>
	);
});

export default memo(DesktopButtonGroup);
