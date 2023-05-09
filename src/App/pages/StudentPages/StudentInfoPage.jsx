import { useGetStudentQuery } from "@/App/providers/apis/studentsApi";
import { useSelector } from "react-redux";
import { statusStudents } from "@/Core/constants/statusStudents";
const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const { data,isLoading } = useGetStudentQuery(user.id);
	console.log(data)
	return (
		<>
			<section className="mb-8 grid grid-cols-2 ">
				<div className="border-r-2">
					<ul className="flex flex-col gap-3">
						<h1 className="mb-3 text-lg font-bold">Thông tin đăng ký</h1>
						<li>Họ và tên : {data?.name}</li>
						<li>Ngành : {data?.majors?.name}</li>
						<li>Khóa học :{data?.course}</li>
						<li>Email : {data?.email}</li>
						<li>                Lựa chọn :{' '}
                {data?.support === 0
                  ? 'Tự tìm nơi thực tập'
                  : '' || data?.support === 1
                  ? 'Nhận hỗ trợ từ nhà trường'
                  : ''}</li>
						<li>Công ty đã chọn:   {data.support === 1
                  ? data?.business?.name
                  : data?.nameCompany}{' '}</li>
						{/* <li>
							Trạng thái sinh viên:  <span style={{color: "#F99011"}}>{statusStudents.map((index) => {
                  if (index.value === statusForm) {
                    return index.title;
                  }
                })}{' '}</span>
						</li> */}
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
