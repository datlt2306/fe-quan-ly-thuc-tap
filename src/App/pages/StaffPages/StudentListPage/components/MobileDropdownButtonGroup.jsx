import Button from "@/Core/components/common/Button";
import { Menu, Transition } from "@headlessui/react";
import { ArrowDownTrayIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment, forwardRef, useRef } from "react";
import { excelSampleData } from "../mocks";
import { useExportToExcel } from "@/App/hooks/useExcel";

const MobileDropdownButtonGroup = ({ tableData, handleImport, handleExport }, ref) => {
	const localRef = useRef(null);
	const fileInputRef = ref || localRef;
	const { handleExportFile } = useExportToExcel();

	const menuItemClasses = () =>
		classNames({
			"flex items-center gap-2 p-2 hover:bg-gray-100 duration-300 whitespace-nowrap select-none cursor-pointer text-base-content text-sm": true,
		});

	return (
		<Menu as="div" className="relative sm:block md:block lg:hidden">
			<Menu.Button as={Fragment}>
				<Button variant="ghost" size="sm" shape="square">
					<EllipsisHorizontalIcon className="h-6 w-6" />
				</Button>
			</Menu.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-x-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-x-1">
				<Menu.Items className="absolute right-0 top-0 z-50 mr-12 flex flex-col rounded-md bg-white shadow">
					<Menu.Item as="label" htmlFor="file-input" className={menuItemClasses()}>
						<DocumentArrowUpIcon className="h-5 w-5 text-[inherit]" /> Tải lên file Excel
						<input ref={fileInputRef} type="file" id="file-input" className="hidden" onChange={(e) => handleExport(e.target.files[0])} />
					</Menu.Item>
					<Menu.Item as="button" className={menuItemClasses()} onClick={() => handleExport(tableData)}>
						<DocumentArrowDownIcon className="h-5 w-5 text-[inherit]" />
						Export file Excel
					</Menu.Item>
					<Menu.Item as="button" className={menuItemClasses()} onClick={() => handleExportFile(excelSampleData)}>
						<ArrowDownTrayIcon className="h-5 w-5 text-[inherit]" />
						Tải file mẫu
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default forwardRef(MobileDropdownButtonGroup);
