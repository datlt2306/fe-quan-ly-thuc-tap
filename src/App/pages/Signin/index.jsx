import {
	Select,
	SelectFieldControl,
} from "@/Core/components/common/FormControl/SelectFieldControl";
import Logo from "/logo.png";
import { useForm } from "react-hook-form";
import Button from "@/Core/components/common/Button";
import google from "/google.svg";
import tw from "twin.macro";
import { useRef, useState } from "react";

const Screen = tw.div`flex h-screen w-full items-center justify-center`;
const Box = tw.div`sm:max-w-full md:max-w-full lg:max-w-xl mx-auto w-full`;
const GoogleIcon = (props) => <img {...props} src={google} tw="w-4 h-4 object-contain" />;
const Image = (props) => <img {...props} tw="mx-auto max-w-[240px] object-cover mb-6" />;
const Form = (props) => <form {...props} tw="flex flex-col space-y-6" />;

export default function SigninPage() {
	// const { control, handleSubmit } = useForm();
	const [isAllowToLoggin, setAllowToLogin] = useState(false);
	const campusRef = useRef(null);
	const campus = [
		{ label: "Hà Nội", value: "1" },
		{ label: "Đà Nẵng", value: "2" },
		{ label: "Hồ Chí Minh", value: "3" },
	];
	return (
		<Screen>
			<Box>
				<Image src={Logo} alt="FPT Polytechnic" />
				<Form>
					<Select onChange={(e) => setAllowToLogin(!!e.target.value)}>
						<option value="">Chọn cơ sở</option>
						{campus.map((camp, index) => {
							return (
								<option key={index} value={camp.value}>
									{camp.label}
								</option>
							);
						})}
					</Select>

					<Button
						variant={isAllowToLoggin ? "primary" : "disabled"}
						size="md"
						disabled={!isAllowToLoggin}
						className="relative">
						<GoogleIcon /> Đăng nhập với tài khoản FPT
					</Button>
				</Form>
			</Box>
		</Screen>
	);
}
