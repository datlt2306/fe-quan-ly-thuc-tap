import Button from '@/Core/components/common/Button';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, forwardRef, memo, useRef } from 'react';
import { studentListSampleData } from '../mocks';
import { useExportToExcel } from '@/App/hooks/useExcel';
import {
	ArrowDownTrayIcon,
	DocumentArrowDownIcon,
	DocumentArrowUpIcon,
	EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

const MobileDropdownButtonGroup = forwardRef(({ tableData, handleImport, handleExport, canImport }, ref) => {
	const localRef = useRef(null);
	const fileInputRef = ref || localRef;
	const { handleExportFile } = useExportToExcel();

	const getMenuItemClassNames = () =>
		classNames({
			'flex items-center gap-2 p-2 hover:bg-gray-100 duration-300 whitespace-nowrap select-none cursor-pointer text-base-content text-sm': true
		});

	return (
		<Menu as='div' className='relative hidden sm:block md:block'>
			<Menu.Button as={Fragment}>
				<Button variant='ghost' size='sm' shape='square'>
					<EllipsisHorizontalIcon className='h-6 w-6' />
				</Button>
			</Menu.Button>
			<Transition
				as={Fragment}
				enter='transition ease-out duration-200'
				enterFrom='opacity-0 translate-x-1'
				enterTo='opacity-100 translate-y-0'
				leave='transition ease-in duration-150'
				leaveFrom='opacity-100 translate-y-0'
				leaveTo='opacity-0 translate-x-1'>
				<Menu.Items className='absolute right-0 top-0 z-50 mr-12 flex flex-col rounded-md bg-white shadow [&>:first-child]:rounded-t-[inherit] [&>:last-child]:rounded-b-[inherit]'>
					<Menu.Item
						as='label'
						htmlFor='file-input'
						aria-disabled={!canImport}
						className={[
							classNames(getMenuItemClassNames(), {
								'btn-disabled pointer-events-none cursor-not-allowed text-disabled': !canImport
							})
						].join(' ')}>
						<DocumentArrowUpIcon className='h-5 w-5 text-[inherit]' /> Tải lên file Excel
						<input
							ref={fileInputRef}
							type='file'
							id='file-input'
							className='hidden'
							onChange={(e) => handleImport(e.target.files[0])}
						/>
					</Menu.Item>
					<Menu.Item as='button' className={getMenuItemClassNames()} onClick={() => handleExport(tableData)}>
						<DocumentArrowDownIcon className='h-5 w-5 text-[inherit]' />
						Export file Excel
					</Menu.Item>
					<Menu.Item
						as='button'
						className={getMenuItemClassNames()}
						onClick={() => handleExportFile(studentListSampleData)}>
						<ArrowDownTrayIcon className='h-5 w-5 text-[inherit]' />
						Tải file mẫu
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	);
});

export default memo(MobileDropdownButtonGroup);
