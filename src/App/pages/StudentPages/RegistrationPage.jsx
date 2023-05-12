import React from "react";
import tw from "twin.macro";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import Button from "@/Core/components/common/Button";
import { useForm } from "react-hook-form";
const Layout = tw.div`grid grid-cols-12 gap-7 items-center `;

const FormRow = ({ label, children }) => (
	<Layout className="my-4">
		<div className="col-span-4 flex justify-end font-medium">{label}:</div>
		<div className="col-span-8 flex items-center gap-4">{children}</div>
	</Layout>
);

const RegistrationPage = () => {
	const { control, handleSubmit } = useForm();

	const RegistrationType = {
		SelfFinding: 0,
		SchoolSupport: 1,
	};
	const onSubmit = async (data) => {
		console.log(data);
	};
	return (
		<>
			<div className="mb-5">Thời gian đăng ký còn lại</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Layout className="my-4 ">
					<div className="col-span-4 sm:col-span-12 sm:justify-start flex justify-end font-medium">Kiểu đăng ký:</div>
					<div className="col-span-8 flex-col sm:justify-start flex items-center gap-4 ">
						<label className="inline-flex items-center">
							<input
								type="radio"
								name="radio"
								defaultValue={RegistrationType.SchoolSupport}
							/>
							<span className="ml-2 font-medium">Nhờ nhà trường hỗ trợ</span>
						</label>
						<label className="inline-flex items-center">
							<input type="radio" name="radio" defaultValue={RegistrationType.SelfFinding} />
							<span className="ml-2 font-medium">Tự tìm nơi thực tập</span>
						</label>
					</div>
				</Layout>

				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium">Mã sinh viên:</div>
					<div className="col-span-8 flex items-center gap-4">PH24952</div>
				</Layout>

				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium">Họ và tên :</div>
					<div className="col-span-8 flex items-center gap-4">
						<p>MInh nguyễn</p>
					</div>
				</Layout>
				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium">
						<b className="pr-1 text-red-500">* </b> <p>Số điện thoại :</p>
					</div>
					<div className="col-span-8 flex items-center gap-4 ">
						<InputFieldControl control={control} name="phone" placeholder="Số điện thoại" />
					</div>
				</Layout>
				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium">
						<b className="pr-1 text-red-500">* </b> <p>Địa chỉ :</p>
					</div>
					<div className="col-span-8 flex items-center gap-4">
						<InputFieldControl control={control} name="address" placeholder="Địa chỉ" />
					</div>
				</Layout>

				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium">
						<b className="pr-1 text-red-500">* </b> <p>Chuyên ngành :</p>
					</div>
					<div className="col-span-8 flex items-center gap-4">
						<InputFieldControl control={control} name="narrow" placeholder="Chuyên ngành" />
					</div>
				</Layout>
				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium">
						<b className="pr-1 text-red-500">* </b> <p>Đơn vị thực tập :</p>
					</div>
					<div className="col-span-8 flex items-center gap-4">
						<InputFieldControl
							// customWrapInput={{className:"flex-1"}}

							control={control}
							name="business"
							placeholder="Chọn doanh nghiệp"
						/>
					</div>
				</Layout>
				<Layout className="my-4 items-center">
					<div className="col-span-4 flex justify-end font-medium">
						<b className="pr-1 text-red-500">* </b> <p>Vị trí thực tập :</p>
					</div>

					<div className="col-span-8 flex flex-1 items-center gap-4">
						<InputFieldControl
							control={control}
							name="dream"
							placeholder="VD: Web Back-end, Dựng phim, Thiết kế nội thất"
						/>
					</div>
				</Layout>
				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium">
						<b className="pr-1 text-red-500">* </b> <p>Upload CV(PDF) :</p>
					</div>
					<div className="col-span-8 flex items-center gap-4">
						<input type="file" />
					</div>
				</Layout>
				<Layout className="my-4">
					<div className="col-span-4 flex justify-end font-medium"></div>
					<div className="col-span-8 flex items-center gap-4">
						<Button type="submit" className="mt-5 bg-secondary text-white">
							Đăng ký
						</Button>
					</div>
				</Layout>
			</form>
		</>
	);
};

export default RegistrationPage;
