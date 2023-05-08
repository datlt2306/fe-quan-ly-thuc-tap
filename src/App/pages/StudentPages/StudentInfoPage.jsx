import { useGetStudentQuery } from "@/App/providers/apis/studentsApi";
import { useSelector } from "react-redux";
import axiosClient from "@/Core/configs/axiosConfig";
import { useEffect } from "react";
const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	// const { data } = useGetStudentQuery(user.id);
	// console.log(data);
	// console.log(data);
	// const StatusRegister={
	// 	1:"Chưa đăng ký,"
	// 	2:
	// 	3:
	// }
	useEffect(() => {
		const getStudent = async () => {
			try {
				const data = await axiosClient.get("/student/" + user.id);
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		};
		getStudent();
	}, []);
	return (
		<>
			<section className="mb-8 grid grid-cols-2 ">
				<div className="border-r-2">
					<ul className="flex flex-col gap-3">
						<h1 className="mb-3 text-lg font-bold">Thông tin đăng ký</h1>
						<li>Họ và tên : Đỗ Xuân Hoàng</li>
						<li>Ngành : Thiết kế trang web</li>
						<li>Khóa học : 17.2</li>
						<li>Email : hoang</li>
						<li>Lựa chọn:</li>
						<li>Công ty đã chọn</li>
						<li>
							Trạng thái sinh viên: <b>Chưa đăng ký </b>{" "}
						</li>
					</ul>
				</div>
				<div className="ml-5 flex flex-col justify-center">
					<ul className="flex flex-col gap-3">
						<h1 className="mb-3 text-lg font-bold">Các form đã nộp</h1>
						<li>Họ và tên : Đỗ Xuân Hoàng</li>
						<li>Ngành : Thiết kế trang web</li>
						<li>Khóa học : 17.2</li>
						<li>Email : hoang</li>
						<li>Lựa chọn:</li>
						<li>Công ty đã chọn</li>
						<li>
							Trạng thái sinh viên: <b>Chưa đăng ký </b>{" "}
						</li>
					</ul>
				</div>
			</section>

			<section className="border-b-2 py-3">
				<h1 className=" text-lg font-bold">Thông tin tuyển dụng</h1>
				<p>Chưa có thông tin thực tập</p>
			</section>
			<section className="mt-3">
				<h1 className="text-lg font-bold	">Ghi chú</h1>
			</section>
		</>
	);
};
export default StudentInfoPage;
