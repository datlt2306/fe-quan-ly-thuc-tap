import { useSelector } from 'react-redux';
import { useMemo } from 'react';

import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';

import Typography from '@/Core/components/common/Text/Typography';

import FormElement from './components/FormElement';

import SuccessStateSection from '../Shared/SuccessStateSection';

const RegistrationPage = () => {
	const user = useSelector((state) => state.auth?.user);

	const { data: student } = useGetOneStudentQuery(user?.id);
	//kiểm tra xem statusCheck có phải là trạng thái sửa cv hoặc chưa đăng ký
	const checkStatusStudent = useMemo(() => {
		return student?.statusCheck == 10 || student?.statusCheck == 1;
	}, [student?.statusCheck]);

	return checkStatusStudent ? (
		<FormElement student={student} />
	) : student?.CV || student?.nameCompany ? (
		<SuccessStateSection
			title='Đã nhận được form đăng ký'
			message='Phòng QHDN sẽ review và xác nhận thông tin của bạn.'
		/>
	) : (
		<FormElement student={student} />
	);
};

export default RegistrationPage;
