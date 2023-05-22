import React from 'react';
import tw from 'twin.macro';
import Text from '../common/Text/Text';
import Typography from '../common/Text/Typography';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const UnsupportScreen = () => {
	return (
		<Screen>
			<Box>
				<Content>
					<ExclamationTriangleIcon className='aspect-square w-8 text-error' />
					<TextBox>
						<Typography level={6}>Ooppsss! Some thing went wrong !</Typography>
						<Text className='sm:text-sm'>Ứng dụng chưa hộ trợ màn hình này. Vui lòng sử dụng thiết bị có tỉ lệ màn hình lớn hơn.</Text>
					</TextBox>
				</Content>
			</Box>
		</Screen>
	);
};

const Screen = tw.div`fixed z-[9999] top-0 w-full h-screen bg-white items-center justify-center hidden sm:flex`;
const Box = tw.div`p-4`;
const Content = tw.div`flex items-center sm:items-start gap-3 text-start max-w-md mx-auto w-full`;
const TextBox = tw.div`flex flex-col gap-1`;

export default UnsupportScreen;
