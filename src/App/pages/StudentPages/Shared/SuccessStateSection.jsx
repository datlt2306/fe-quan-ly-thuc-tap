import Text from '@/Core/components/common/Text/Text';
import Typography from '@/Core/components/common/Text/Typography';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import tw from 'twin.macro';

export default function SuccessStateSection({ title, message }) {
	return (
		<Container>
			<Box>
				<DocumentCheckIcon width={40} height={40} className='text-success' />
				<div>
					<Typography level={6} fontWeight='semibold'>
						{title}
					</Typography>
					<Text className='mt-1 text-gray-500'>{message}</Text>
				</div>
			</Box>
		</Container>
	);
}

const Box = tw.div`max-w-lg mx-auto rounded-lg flex flex-col place-content-center place-items-center items-center justify-center gap-4 text-center`;
const Container = tw.div`flex items-center justify-center h-full`;
