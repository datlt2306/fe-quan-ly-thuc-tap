import Text from '@/Core/components/common/Text/Text';
import { Fragment } from 'react';
import tw from 'twin.macro';
import Instruction from './components/Instruction';
import Step from './components/Step';
import { ViewProvider } from './context/ViewContext';

const InstructionPage = () => {
	return (
		<ViewProvider>
			<Container>
				<Section className='basis-1/4'>
					<Text className='mb-6 font-medium text-base-content'>Các bước thực hiện</Text>
					<Step />
				</Section>
				<Section className='basis-3/4'>
					<Instruction />
				</Section>
			</Container>
		</ViewProvider>
	);
};

const Container = tw.div`relative h-full flex flex-row-reverse items-stretch gap-10`;
const Section = tw.div`flex flex-col`;

export default InstructionPage;
