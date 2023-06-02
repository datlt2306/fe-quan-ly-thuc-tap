import React, { Fragment } from 'react';
import Modal from '@/Core/components/common/Modal';
import tw from 'twin.macro';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import Button from '@/Core/components/common/Button';
import LoadingData from '@/App/pages/StudentPages/Shared/LoadingData';
import formatDate from '@/Core/utils/formatDate';
import moment from 'moment';
import { handleGetInternStatusStyle } from '@/App/pages/StudentPages/StudentInfoPage';
import { StudentStatusEnum } from '@/App/constants/studentConstants';
import Badge from '@/Core/components/common/Badge';
import { InternSupportType } from '@/App/constants/studentConstants';
const InfoStudentModal = ({ id, onOpenStateChange, openState }) => {
	const { data: student, isFetching } = useGetOneStudentQuery(id);
	const { data: times } = useGetSetTimeQuery({ typeNumber: student?.support });
	const formTime = times?.time;

	const formSchoolSupport = student?.support == 1;
	const formSelfFinding = student?.support == 0;
	const StudentInfo = [
		{ label: 'Họ tên: ', value: student?.name },
		{ label: 'Mã sinh viên: ', value: student?.mssv },
		{ label: 'Email: ', value: student?.email },
		{ label: 'Chuyên Ngành: ', value: student?.major?.name },
		{ label: 'Khóa học: ', value: student?.course },
		{ label: 'Kỳ thực tập: ', value: student?.smester_id?.name },
		{ label: 'Số điện thoại: ', value: student?.phoneNumber },
		{ label: 'Địa chỉ: ', value: student?.address },
		{
			label: 'Phân loại: ',
			value: (formSchoolSupport || formSelfFinding) && InternSupportType[+student?.support]
		},
		{
			label: 'Trạng thái sinh viên: ',
			value: student?.statusStudent
		},
		{
			label: 'Ngày bổ sung: ',
			value: student?.createdAt ? formatDate(student?.createdAt) : null
		},
		{
			content: <View label='CV' condition={student?.CV} />
		},
		{ label: 'SV đã được hỗ trợ TT:', value: student?.updatedInStage ? student?.updatedInStage + ' lần ' : null }
	];

	const CompanyInfo = [
		{
			label: 'Tên công ty:',
			value: formSchoolSupport ? student?.business?.name : student?.nameCompany
		},
		{
			label: 'Địa chỉ công ty:',
			value: formSchoolSupport ? student?.business?.address : student?.addressCompany
		},
		{ label: 'Mã số thuế:', value: formSchoolSupport ? student?.business?.tax_code : student?.taxCode },
		{ label: 'Vị trí thực tập:', value: student?.dream },
		{ label: 'SĐT công ty:', value: student?.phoneNumberCompany },
		{ label: 'Tên người tiếp nhận:', value: student?.nameEnterprise },
		{ label: 'Email người tiếp nhận:', value: student?.emailEnterprise },
		{ label: 'Ngày bắt đầu thực tập:', value: student?.internshipTime ? formatDate(student?.internshipTime) : null },
		{
			label: 'Ngày kết thúc thực tập:',
			value: student?.endInternShipTime ? formatDate(student?.endInternShipTime) : null
		},
		{ label: 'Điểm thái độ:', value: student?.attitudePoint },
		{ label: 'Điểm kết thúc:', value: student?.resultScore },
		{ content: <View label='Biên Bản' condition={student?.form} /> },
		{ content: <View label='Báo Cáo' condition={student?.report} /> }
	];

	const FormInfo = [
		{
			content: <RenderStatusStudent statusCheck={student?.statusCheck} />
		},
		{ label: 'Người review: ', value: student?.reviewer },
		{ label: 'Công ty: ', value: student?.nameCompany },
		{ content: <Title>Thời gian hiển thị form nhập</Title> },
		{
			label: formTime?.typeName ? `${formTime?.typeName}:` : 'Form đăng ký:',
			value:
				formSchoolSupport || formSelfFinding
					? `Từ ${moment(formTime?.startTime).format('DD/MM/YYYY')} đến  ${moment(formTime?.endTime).format(
							'DD/MM/YYYY'
					  )} `
					: 'Chưa có thông tin'
		}
	];

	return (
		<Modal openState={openState} onOpenStateChange={onOpenStateChange} title={'Thông tin sinh viên'}>
			{isFetching ? (
				<LoadingData />
			) : (
				<GridLayout>
					<RenderListItem arr={StudentInfo} />
					<RenderListItem arr={CompanyInfo} />
					<RenderListItem arr={FormInfo} border />
				</GridLayout>
			)}
		</Modal>
	);
};

const RenderListItem = ({ arr, border }) => {
	const Border = border ? BorderBox : Fragment;
	return (
		<Col_4>
			<Border>
				<UnorderedList>
					{arr.map((item, index) => (
						<ListItem key={index}>
							{item?.content ? (
								item?.content
							) : (
								<Fragment>
									<Title>{item.label} </Title>
									<p>{item.value || 'Chưa có thông tin'}</p>
								</Fragment>
							)}
						</ListItem>
					))}
				</UnorderedList>
			</Border>
		</Col_4>
	);
};
const RenderStatusStudent = ({ statusCheck }) => {
	return (
		<Fragment>
			<Title>Trạng thái:</Title>
			<Badge variant={handleGetInternStatusStyle(statusCheck)}>{StudentStatusEnum[statusCheck]}</Badge>
		</Fragment>
	);
};
const View = ({ label, condition }) => {
	return (
		<div className='flex items-center gap-2'>
			<Title>{label}:</Title>
			{condition ? (
				<Button variant='outline' onClick={() => window.open(condition)}>
					Xem
				</Button>
			) : (
				<p>Chưa có thông tin</p>
			)}
		</div>
	);
};
const GridLayout = tw.div`grid grid-cols-12 gap-10`;
const Col_4 = tw.div`col-span-4 pr-4`;
const BorderBox = tw.div`border p-4`;
const ListItem = tw.span`py-[5px] flex items-center  gap-1`;
const Title = tw.b`font-semibold`;
const UnorderedList = tw.ul`flex flex-col gap-2`;
export default InfoStudentModal;
