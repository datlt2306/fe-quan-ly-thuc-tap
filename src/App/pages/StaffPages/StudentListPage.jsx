import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import Button from "@/Core/components/common/Button";
import { Option, Select } from "@/Core/components/common/FormControl/SelectFieldControl";
import SlideOver from "@/Core/components/common/SlideOver";
import Table, { InputColumnFilter } from "@/Core/components/common/Table/ReactTable";
import { Input } from "@/Core/components/common/FormControl/TextFieldControl";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo, useState } from "react";
import tw from "twin.macro";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import Modal from "@/Core/components/common/Modal";
import ButtonGroup from "@/Core/components/common/Button/ButtonGroup";
import { toast } from "react-toastify";

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const initialData = [
	["MSV", "Thành viên", "Số điện thoại", "Mail cá nhân", "Mail FPT", "Git Account"],
];

const StudentListPage = () => {
	const [students, setStudents] = useState([]);
	const { data, handleGetFile } = useImportFromExcel();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [modalState, setModalState] = useState({
		open: false,
		result: false,
	});
	const handleExport = useExportToExcel({
		fileName: "Danh sách sinh viên",
		data: data.length > 0 ? data : initialData,
	});

	useEffect(() => {
		const keys = data.shift();

		const result = data.map((array, index) =>
			array.reduce((object, value, i) => {
				object[keys[i]] = value;
				return { id: index + 1, ...object };
			}, {})
		);
		console.log(result);
		/**
		 * validate result
		 * ok -> render into table
		 * not ok -> show error
		 */

		setStudents(result);
	}, [data]);

	const handleImportFile = (e) => {
		handleGetFile(e.target.files[0]);
	};

	const columnsData = useMemo(
		() => [
			{
				Header: "MSV",
				accessor: "id", // object key
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
				canSort: true,
				canFilter: true,
			},
			{
				Header: "Thành viên",
				accessor: "Thành viên",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Số điện thoại",
				accessor: "Số điện thoại",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Mail cá nhân",
				accessor: "Mail cá nhân",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Mail FPT",
				accessor: "Mail FPT",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Git Account",
				accessor: "Git Account",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Thao tác",
				canFilter: false,
				canSort: false,
				filterable: false,
				isSort: false,
				Cell: (
					<ButtonList>
						<Button type="button" size="xs" variant="secondary">
							Chỉnh sửa
						</Button>
						<PopConfirm
							okText="Ok"
							cancelText="Cancel"
							title={"Xóa sinh viên"}
							description={"Bạn muốn xóa sinh viên này ?"}
							// onCancel={() => toast.info("Cancelled")}
							onConfirm={() => toast.info("Removed")}>
							<Button size="xs" variant="error">
								Xóa
							</Button>
						</PopConfirm>
					</ButtonList>
				),
			},
		],
		[]
	);

	return (
		<Fragment>
			<SlideOver open={slideOverVisibility} onOpen={setSlideOverVisibility}>
				{/* Add student form */}
			</SlideOver>
			{/* <ModalConfirm
				title={"Xóa sinh viên khỏi danh sách"}
				open={modalState.open}
				setResult={setModalState}
				content={"Bạn chắc chắn muốn xóa sinh viên này ?"}
			/> */}

			<Box>
				<ButtonList>
					<Button
						type="button"
						variant="primary"
						size="sm"
						onClick={() => setSlideOverVisibility(!slideOverVisibility)}>
						<PlusIcon className="h-3 w-3 text-[inherit]" /> Thêm mới sinh viên
					</Button>

					<Button as="label" size="sm" htmlFor="file-input">
						<ArrowUpIcon className="h-3 w-3 text-[inherit]" /> Import file Excel
						<input
							type="file"
							id="file-input"
							className="hidden"
							onChange={(e) => handleImportFile(e)}
						/>
					</Button>

					<Button type="button" variant="outline" size="sm" onClick={handleExport}>
						<ArrowDownIcon className="h-3 w-3 text-[inherit]" />
						Export file Excel
					</Button>
				</ButtonList>

				<Table columns={columnsData} data={students} />
			</Box>
		</Fragment>
	);
};

export default StudentListPage;
