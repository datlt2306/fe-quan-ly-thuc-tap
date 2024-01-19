import { useExportToExcel } from '@/App/hooks/useExcel';
import Box from '@/Core/components/common/Box';
import Button from '@/Core/components/common/Button';
import { ArrowDownTrayIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { forwardRef, memo, useRef } from 'react';
import { studentListSampleData } from '../mocks';

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
						handleImport(e.target.files[0]).then(() => {
							e.target.value = '';
						});
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
