import { SelectFieldControl } from "@/Core/components/common/SelectFieldControl";
import Logo from "/logo.png";
import { useForm } from "react-hook-form";
import Button from "@/Core/components/common/Button";
import google from "/google.svg";
import tw from "twin.macro";

const Screen = tw.div`flex h-screen w-full items-center justify-center`;
const Box = tw.div`sm:max-w-full md:max-w-full lg:max-w-xl mx-auto w-full`;
const GoogleIcon = (props) => <img {...props} src={google} tw="w-4 h-4 object-contain" />;
const Image = (props) => <img {...props} tw="mx-auto max-w-[240px] object-cover mb-6" />;
const Form = (props) => <form {...props} tw="flex flex-col space-y-6" />;

export default function SigninPage() {
	const { control, handleSubmit } = useForm();
	const campus = [
		{ label: "Hà Nội", value: "1" },
		{ label: "Đà Nẵng", value: "2" },
		{ label: "Hồ Chí Minh", value: "3" },
	];
	return (
		<Screen>
			<Box>
				<Image src={Logo} alt="FPT Polytechnic" />
				<Form onSubmit={handleSubmit()}>
					<SelectFieldControl control={control} name="campus" options={campus} />

					<Button>
						<GoogleIcon /> Đăng nhập với tài khoản FPT
					</Button>
				</Form>
			</Box>
		</Screen>
	);
}
