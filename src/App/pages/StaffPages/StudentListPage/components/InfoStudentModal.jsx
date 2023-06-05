import React, { Fragment } from 'react';
import Modal from '@/Core/components/common/Modal';
import tw from 'twin.macro';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import Button from '@/Core/components/common/Button';
import LoadingData from '@/App/pages/StudentPages/Shared/LoadingData';
import formatDate from '@/Core/utils/formatDate';
import { handleGetInternStatusStyle } from '@/App/pages/StudentPages/StudentInfoPage';
import { StudentStatusEnum } from '@/App/constants/studentConstants';
import Badge from '@/Core/components/common/Badge';
import { InternSupportType } from '@/App/constants/studentConstants';
import Text from '@/Core/components/common/Text/Text';
const InfoStudentModal = ({ id, onOpenStateChange, openState }) => {
	const { data: student, isFetching } = useGetOneStudentQuery(id);
	const { data: times } = useGetSetTimeQuery({ typeNumber: student?.support });
	const formTime = times?.time;

	const formSchoolSupport = student?.support == 1;
	const formSelfFinding = student?.support == 0;

	const StudentInfo = [
		{ label: 'Họ tên ', value: student?.name },
		{ label: 'Mã sinh viên ', value: student?.mssv },
		{ label: 'Email ', value: student?.email },
		{ label: 'Chuyên Ngành ', value: student?.major?.name },
		{ label: 'Khóa học ', value: student?.course },
		{ label: 'Kỳ thực tập ', value: student?.smester_id?.name },
		{ label: 'Số điện thoại ', value: student?.phoneNumber },
		{ label: 'Địa chỉ ', value: student?.address },
		{
			label: 'Phân loại ',
			value: (formSchoolSupport || formSelfFinding) && InternSupportType[+student?.support]
		},
		{
			label: 'Trạng thái sinh viên ',
			value: student?.statusStudent
		},
		{
			label: 'Ngày bổ sung ',
			value: student?.createdAt ? formatDate(student?.createdAt) : null
		},
		{
			content: <View label='CV' condition={student?.CV} />
		},
		{ label: 'SV đã được hỗ trợ TT', value: student?.updatedInStage ? student?.updatedInStage + ' lần ' : null }
	];

	const CompanyInfo = [
		{
			label: 'Tên công ty',
			value: formSchoolSupport ? student?.business?.name : student?.nameCompany
		},
		{
			label: 'Địa chỉ công ty',
			value: formSchoolSupport ? student?.business?.address : student?.addressCompany
		},
		{ label: 'Mã số thuế', value: formSchoolSupport ? student?.business?.tax_code : student?.taxCode },
		{ label: 'Vị trí thực tập', value: student?.dream },
		{ label: 'SĐT công ty', value: student?.phoneNumberCompany },
		{ label: 'Tên người tiếp nhận', value: student?.employer },
		{ label: 'Email người tiếp nhận', value: student?.emailEnterprise },
		{ label: 'Ngày bắt đầu thực tập', value: student?.internshipTime ? formatDate(student?.internshipTime) : null },
		{
			label: 'Ngày kết thúc thực tập',
			value: student?.endInternShipTime ? formatDate(student?.endInternShipTime) : null
		},
		{ label: 'Điểm thái độ', value: student?.attitudePoint },
		{ label: 'Điểm kết thúc', value: student?.resultScore },
		{ content: <View label='Biên Bản' condition={student?.form} /> },
		{ content: <View label='Báo Cáo' condition={student?.report} /> }
	];

	const FormInfo = [
		{
			label: 'Trạng thái',
			value: (
				<Badge variant={handleGetInternStatusStyle(student?.statusCheck)}>
					{StudentStatusEnum[student?.statusCheck]}
				</Badge>
			)
		},
		{ label: 'Người review ', value: student?.reviewer },
		{ label: 'Công ty ', value: student?.nameCompany },
		{
			content: (
				<Text color='text-primary' tw='font-medium'>
					Thời gian hiển thị form nhập
				</Text>
			),
			className: 'grid-cols-1'
		},
		{
			label: formTime?.typeName ? `${formTime?.typeName}` : 'Form đăng ký',
			value: (formSchoolSupport || formSelfFinding) && (
				<Text tw='font-semibold'>
					Từ {formatDate(formTime?.startTime)} đến {formatDate(formTime?.endTime)}
				</Text>
			),
			className: (formSchoolSupport || formSelfFinding) && 'grid-cols-1 gap-1'
		}
	];

	return (
		<Modal openState={openState} onOpenStateChange={onOpenStateChange} title={'Thông tin sinh viên'}>
			{isFetching ? (
				<LoadingData />
			) : (
				<Modal.Content>
					<Grid>
						<RenderListItem arr={StudentInfo} />
						<RenderListItem arr={CompanyInfo} />
						<RenderListItem arr={FormInfo} />
					</Grid>
				</Modal.Content>
			)}
		</Modal>
	);
};

const RenderListItem = ({ arr }) => {
	return (
		<Grid.Col>
			<List>
				{arr.map((item, index) => {
					const className = item?.className ? item.className : null;
					return (
						<List.Item key={index} className={className}>
							{item?.content ? (
								item?.content
							) : (
								<Fragment>
									<Title>{item.label} </Title>
									<p>{item.value || 'Chưa có thông tin'}</p>
								</Fragment>
							)}
						</List.Item>
					);
				})}
			</List>
		</Grid.Col>
	);
};
const View = ({ label, condition }) => {
	return (
		<Fragment>
			<Title>{label}</Title>
			{condition ? (
				<Button variant='outline' onClick={() => window.open(condition)}>
					Xem
				</Button>
			) : (
				<p>Chưa có thông tin</p>
			)}
		</Fragment>
	);
};
const Grid = tw.div`grid grid-cols-[4fr,4fr,4fr] gap-1 divide-x divide-gray-300`;
Grid.Col = tw.div``;
const Title = tw.b`font-semibold`;
const List = tw.ul`flex flex-col divide-y divide-gray-300  p-2`;
// List.Item = tw.span`py-[5px] flex items-center  gap-1`;
List.Item = tw.li`p-3 inline-grid grid-cols-2 items-baseline `;
Modal.Content = tw.div`min-w-[1100px] w-full max-w-full`;

export default InfoStudentModal;
