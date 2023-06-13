import useLocalStorage from '@/App/hooks/useLocalstorage';
import { useSigninMutation } from '@/App/providers/apis/authApi';
import { useGetAllCampusQuery } from '@/App/providers/apis/campusApi';
import { getCurrentCampus } from '@/App/providers/slices/campusSlice';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import { GoogleLogin } from '@react-oauth/google';
import classNames from 'classnames';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import Logo from '/logo.png';
import { useGetDefaultSemsterQuery } from '@/App/providers/apis/semesterApi';

export default function SigninPage() {
	const [isAllowToLoggin, setAllowToLogin] = useState(false);
	const [currentCampus, setCurrentCampus] = useState(null);
	const { data: listCampus } = useGetAllCampusQuery();
	const [signinMutation, { isLoading }] = useSigninMutation();
	const { data: defaultSemester } = useGetDefaultSemsterQuery({ campus_id: currentCampus }, { skip: !currentCampus });
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [_accessToken, setAccessToken] = useLocalStorage('access_token', null);

	// Chọn cơ sở
	const handleSelectCampus = (campus) => {
		setCurrentCampus(campus);
		setAllowToLogin(!!campus);
	};

	// Login với tài khoản Google
	const signinCallback = async (accessToken) => {
		try {
			const response = await signinMutation({
				campus_id: currentCampus,
				smester_id: defaultSemester?._id,
				token: accessToken
			}).unwrap();
			dispatch(getCurrentCampus(listCampus.find((campus) => campus._id === currentCampus)));
			setAccessToken(`Bearer ${response?.accessToken}`);
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
					<Select onChange={(e) => handleSelectCampus(e.target.value)} className='capitalize'>
						<Option value=''>Chọn cơ sở</Option>
						{Array.isArray(listCampus) &&
							listCampus?.map((campus) => (
								<Option key={campus?._id} value={campus?._id}>
									{campus?.name}
								</Option>
							))}
					</Select>
					<GoogleLoginWrapper
						className={classNames({
							'pointer-events-none select-none opacity-50': !isAllowToLoggin
						})}>
						<GoogleLogin
							onSuccess={(credentialResponse) => signinCallback(credentialResponse?.credential)}
							logo_alignment='center'
							theme={isAllowToLoggin ? 'filled_blue' : 'outline'}
							size='large'
							style
						/>
					</GoogleLoginWrapper>
				</Form>
			</Box>
			<Footer>© {new Date().getFullYear()} FPT Polytechic College, Inc. All rights reserved.</Footer>
		</Screen>
	);
}

const GoogleLoginWrapper = tw.div`duration-300 w-full flex justify-center gap-3 items-center before:([content:''] basis-1/3 border-t border-gray-300) after:([content:''] basis-1/3 border-t border-gray-300)`;
const Screen = tw.div`sm:(max-w-full px-4) relative flex h-screen w-full items-center justify-center lg:bg-gray-50 bg-white`;
const Box = tw.div`max-w-xl w-full p-8 shadow-2xl mx-auto bg-white rounded-lg sm:(shadow-none)`;
const Image = tw.img`mx-auto max-w-full object-cover mb-10`;
const Form = tw.div`flex items-center justify-center flex-col gap-3 w-full min-w-fit`;
const Footer = tw.small`absolute bottom-4 text-center text-base-content`;
