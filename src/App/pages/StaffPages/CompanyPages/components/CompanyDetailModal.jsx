import Modal from '@/Core/components/common/Modal';
import React from 'react';
import tw from 'twin.macro';
import { columnAccessors } from '../constants';

const CompanyDetailModal = ({ openState, onOpenStateChange: handleOpenStateChange, modalData }) => {
	return (
		<Modal openState={openState} onOpenStateChange={handleOpenStateChange} title={modalData?.title}>
			<Modal.Content>
				<List>
					<List.Item>{columnAccessors.requirement}</List.Item>
					<List.Item>{modalData.data?.requirement || 'Không có'}</List.Item>
				</List>
				<List>
					<List.Item>{columnAccessors.description}</List.Item>
					<List.Item>{modalData.data?.description || 'Không có'}</List.Item>
				</List>
				<List>
					<List.Item>{columnAccessors.benefit}</List.Item>
					<List.Item>{modalData.data?.benefit || 'Không có'}</List.Item>
				</List>
			</Modal.Content>
		</Modal>
	);
};
const List = tw.ol`grid grid-cols-[1fr,3fr] [&>:first-child]:(font-medium)`;
List.Item = tw.li`whitespace-normal first-letter:uppercase p-4`;
Modal.Content = tw.div`flex flex-col items-stretch divide-y divide-gray-200 max-w-2xl`;

export default CompanyDetailModal;
