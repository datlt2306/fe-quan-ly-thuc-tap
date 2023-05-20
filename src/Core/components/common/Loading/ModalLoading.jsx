import { LoadingSpinner } from './LoadingSpinner';
const ModalLoading = () => {
	return (
		<div className='fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-800  bg-opacity-80'>
			<div className='flex flex-col items-center  justify-center gap-2'>
				<LoadingSpinner variant={'primary'} size='lg' />
				<h2 className='text-center text-xl font-semibold text-white '>Loading...</h2>
			</div>
		</div>
	);
};

export default ModalLoading;
