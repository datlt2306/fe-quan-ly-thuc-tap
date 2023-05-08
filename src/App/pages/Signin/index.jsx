import useLocalStorage from "@/App/hooks/useLocalstorage";
import { useSigninMutation } from "@/App/providers/apis/authApi";
import { useGetAllCampusQuery } from "@/App/providers/apis/campusApi";
import { Option, Select } from "@/Core/components/common/FormControl/SelectFieldControl";
import axiosClient from "@/Core/configs/axiosConfig";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import tw from "twin.macro";
import BeeImage from "/bee.png";
import google from "/google.svg";
import Logo from "/logo.png";

const Screen = tw.div`relative flex h-screen w-full items-center justify-center lg:bg-gray-50`;
const Box = tw.div`sm:max-w-full md:max-w-full lg:(max-w-xl w-full p-8 shadow-2xl ) mx-auto bg-white rounded-lg`;
const Image = tw.img`mx-auto max-w-full object-cover mb-10`;
const ImageDecorator = tw.img`absolute bottom-0 right-2 max-w-full object-cover invisible lg:visible`;
const Form = tw.div`flex items-center justify-center flex-col gap-3 w-full`;
const GoogleIcon = (props) => <img {...props} src={google} tw="w-4 h-4 object-contain" />;

export default function SigninPage() {
	const [isAllowToLoggin, setAllowToLogin] = useState(false);
	const [loginInformation, setLoginInformation] = useState(null);
	const { data } = useGetAllCampusQuery();
	const [signinMutation, { isLoading }] = useSigninMutation();
	const navigate = useNavigate();
	const [accessToken, setAccessToken] = useLocalStorage("access_token", null);

	// Chọn cơ sở
	const handleSelectCampus = async (campus) => {
		try {
			const defaultSemester = await axiosClient.get("/smester/default", {
				params: { campus_id: campus },
			});

			setLoginInformation({
				smester_id: defaultSemester.result?._id,
				cumpusId: defaultSemester.result?.campus_id,
			});

			setAllowToLogin(!!campus);
		} catch (error) {
			console.log(error.message);
			setAllowToLogin(false);
		}
	};

	// Login với tài khoản Google
	const signinCallback = async (accessToken) => {
		try {
			const response = await signinMutation({
				...loginInformation,
				token: accessToken,
			});
			console.log(response);
			if (!response.data?.success) {
				toast.error("Đăng nhập thất bại!");
				return;
			}
			setAccessToken(`Bearer ${response?.data?.token}`);
			toast.success("Đăng nhập thành công");
			navigate("/");
		} catch (error) {
			toast.error("Đăng nhập thất bại!");
		}
	};

	return (
		<Screen>
			<Box>
				<Image src={Logo} alt="FPT Polytechnic" />
				<Form>
					<Select onChange={(e) => handleSelectCampus(e.target.value)}>
						<Option>Chọn cơ sở</Option>
						{Array.isArray(data?.listCumpus) &&
							data?.listCumpus?.map((camp) => (
								<Option key={camp?._id} value={camp?._id}>
									{camp?.name}
								</Option>
							))}
					</Select>
					<div
						className={classNames("duration-300", {
							"pointer-events-none opacity-50": !isAllowToLoggin,
						})}>
						<GoogleLogin
							onSuccess={(credentialResponse) =>
								signinCallback(credentialResponse?.credential)
							}
							logo_alignment="center"
							theme={isAllowToLoggin ? "filled_blue" : "outline"}
							size="large"
							style
						/>
					</div>
				</Form>
			</Box>
			<ImageDecorator src={BeeImage} className="" />
		</Screen>
	);
}
