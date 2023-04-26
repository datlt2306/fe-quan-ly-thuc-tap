import Button from "@/Core/components/common/Button";
import Table from "@/Core/components/common/Table";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import tw from "twin.macro";

const Avatar = (props) => <img src={props.src} {...props} tw="inline-block h-8 w-8 rounded-md" />;

const HomePage = () => {
	const [students, setStudents] = useState([]);
	useEffect(() => {
		axios
			.get("https://reqres.in/api/users")
			.then(({ data }) => {
				console.log(data);
				setStudents(data.data);
			})
			.catch((error) => {
				console.log(error);
				setStudents([]);
			});
	}, []);
	const columnsData = useMemo(
		() => [
			{
				Header: "#",

				accessor: "id",
			},
			{
				Header: "Picture",
				accessor: "avatar",
				Cell: (tableProps) => <Avatar src={tableProps.row.original.avatar} />,
			},
			{
				Header: "Email",
				accessor: "email",
			},
			{
				Header: "First Name",
				accessor: "first_name",
			},
			{
				Header: "Last Name",
				accessor: "last_name",
			},
			{
				Header: "Actions",
				accessor: "actions",
				Cell: (
					<div className="flex items-center gap-1">
						<Button size="sm" color="secondary">
							Chỉnh sửa
						</Button>
						<Button size="sm" color="error">
							Xóa
						</Button>
					</div>
				),
			},
		],
		[]
	);

	return (
		<div>
			<Button color="primary" size={"sm"}>
				Thêm mới sinh viên
			</Button>
			<Table columns={columnsData} data={students} />
		</div>
	);
};

export default HomePage;
