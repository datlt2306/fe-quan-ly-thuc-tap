import useLocalStorage from '@/App/hooks/useLocalstorage';
import { useAdminSigninMutation } from '@/App/providers/apis/authApi';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import Logo from '/logo.png';

export default function SigninPage() {
	const [isAllowToLoggin, setAllowToLogin] = useState(false);
	const [signinMutation, { isLoading }] = useAdminSigninMutation();
	const navigate = useNavigate();
	const [accessToken, setAccessToken] = useLocalStorage('access_token', null);

	// Login với tài khoản Google
	const signinCallback = async (accessToken) => {
		try {
			const response = await signinMutation({
				token: accessToken
			});
			if (!response.data?.success) {
				toast.error('Đăng nhập thất bại !');
				return;
			}
			setAccessToken(`Bearer ${response?.data?.accessToken}`);
			toast.success('Đăng nhập thành công !');
			navigate('/');
		} catch (error) {
			toast.error('Đăng nhập thất bại !');
		}
	};

	return (
		<Screen>
			<Box>
				<Image src={Logo} alt='FPT Polytechnic' />
				<Form>
					<GoogleLogin
						onSuccess={(credentialResponse) => signinCallback(credentialResponse?.credential)}
						logo_alignment='center'
						theme={isAllowToLoggin ? 'filled_blue' : 'outline'}
						size='large'
						style
					/>
				</Form>
			</Box>
			<Footer>© 2020 FPT Polytechic College, Inc. All rights reserved.</Footer>
		</Screen>
	);
}

const Screen = tw.div`sm:(max-w-full px-4) relative flex h-screen w-full items-center justify-center lg:bg-gray-50 bg-white`;
const Box = tw.div`max-w-xl w-full p-8 shadow-2xl mx-auto bg-white rounded-lg sm:(shadow-none)`;
const Image = tw.img`mx-auto max-w-full object-cover mb-10`;
const Form = tw.div`flex items-center justify-center flex-col gap-3 w-full min-w-fit`;

const Footer = tw.small`absolute bottom-4 text-center text-gray-500`;
