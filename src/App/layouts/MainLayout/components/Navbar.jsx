import Button from '@/Core/components/common/Button';
import { Popover, Transition } from '@headlessui/react';
import { ArrowLeftOnRectangleIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';
import Breadcrumbs from './Breadcrumbs';
import { signout } from '@/App/store/reducers/authSlice';
import { useDispatch } from 'react-redux';
import useLocalStorage from '@/App/hooks/useLocalstorage';

const Navbar = ({ onToggleSidebar, navigation }) => {
	const user = useSelector((state) => state.auth?.user);
	const dispatch = useDispatch();
	const [accessToken, setAccessToken] = useLocalStorage('access_token', null);
	const handleSignout = () => {
		dispatch(signout());
		setAccessToken(null);
	};

	return (
		<StickyHeader>
			<NavbarStart>
				<Button
					variant='ghost'
					shape='square'
					size='sm'
					className='hidden sm:inline-flex md:inline-flex'
					onClick={() => onToggleSidebar(true)}>
					<Bars3Icon className='h-5 w-5' aria-hidden='true' />
				</Button>

				<Separator />

				<Breadcrumbs navigation={navigation} />
			</NavbarStart>

			<Popover as='div' className='relative'>
				<Popover.Button className='-m-1.5 flex items-center p-1.5 outline-none'>
					<Avatar className='h-8 w-8 rounded-full bg-gray-50' src={user?.picture} alt='picture' />
					<span className='flex items-center'>
						<span className='ml-4 text-sm font-semibold leading-6 text-gray-900' aria-hidden='true'>
							{user?.displayName}
						</span>
						<ChevronDownIcon className='ml-2 h-5 w-5 text-gray-400' aria-hidden='true' />
					</span>
				</Popover.Button>
				<Transition
					as={Fragment}
					enter='transition ease-out duration-200'
					enterFrom='opacity-0 translate-y-1'
					enterTo='opacity-100 translate-y-0'
					leave='transition ease-in duration-150'
					leaveFrom='opacity-100 translate-y-0'
					leaveTo='opacity-0 translate-y-1'>
					<Popover.Panel
						className='group absolute right-0 z-10 mt-2.5 flex w-fit origin-top-right cursor-pointer flex-col gap-1 rounded-md bg-white p-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'
						as='ul'>
						<li
							className='flex items-center gap-2 whitespace-nowrap p-2 hover:bg-gray-100'
							onClick={handleSignout}>
							<ArrowLeftOnRectangleIcon className='h-5 w-5 text-gray-700' /> Đăng xuất
						</li>
					</Popover.Panel>
				</Transition>
			</Popover>
		</StickyHeader>
	);
};
// Styled components
const StickyHeader = tw.div`sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 justify-between lg:justify-between`;
const Avatar = tw.img`h-8 w-8 rounded-full bg-gray-50`;
const Separator = tw.div`hidden sm:hidden md:block h-6 w-px bg-gray-200`;
const NavbarStart = tw.div`flex items-center gap-3`;

export default Navbar;
