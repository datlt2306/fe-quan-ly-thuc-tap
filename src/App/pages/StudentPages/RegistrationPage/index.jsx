import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useGetOneStudentQuery } from '@/App/store/apis/studentApi';
import FormElement from './components/FormElement';
import SuccessStateSection from '../Shared/SuccessStateSection';
import { StudentStatusCodeEnum } from '@/App/constants/studentConstants';
import EmptyStateSection from '../Shared/EmptyStateSection';

const RegistrationPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const { data: student } = useGetOneStudentQuery(user?.id);
	console.log(student?.statusCheck);
	//Kiểm tra xem statusCheck có phải là trạng thái sửa cv hoặc chưa đăng ký
	const checkStatusStudent = useMemo(() => {
		return (
			student?.statusCheck === StudentStatusCodeEnum.NOT_REGISTERED ||
			student?.statusCheck === StudentStatusCodeEnum.REVISE_CV
		);
	}, [student?.statusCheck]);

	return checkStatusStudent ? (
		<FormElement student={student} />
	) : student?.CV || student?.nameCompany ? (
		<SuccessStateSection
			title='Đã nhận được form đăng ký'
			message='Phòng QHDN sẽ review và xác nhận thông tin của bạn.'
		/>
	) : (
		<EmptyStateSection title='Form đăng ký không khả dụng' message='Sinh viên hiện không đủ điều kiện ' />
	);
};

export default RegistrationPage;
