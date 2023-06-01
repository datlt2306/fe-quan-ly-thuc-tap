import { BasePaths, ManagerPaths, StaffPaths, StudentPaths } from '@/Core/constants/routePaths';
import { UserRoleEnum } from '@/App/constants/userRoles';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetAllSemestersQuery } from '../providers/apis/semesterApi';

const DefaultPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const currentCampus = useSelector((state) => state.campus?.currentCampus);
	useGetAllSemestersQuery({ campus_id: currentCampus?._id }, { skip: !currentCampus });

	switch (user.role) {
		case UserRoleEnum.STUDENT:
			return <Navigate to={StudentPaths.STUDENT_INFO} replace={true} />;
		case UserRoleEnum.STAFF:
			return <Navigate to={StaffPaths.STUDENT_LIST} replace={true} />;
		case UserRoleEnum.MANAGER:
			return <Navigate to={ManagerPaths.STAFF_LIST} replace={true} />;
		default:
			toast.error('Vai trò người dùng không nằm trong hệ thống', {
				icon: XCircleIcon
			});
			return <Navigate to={BasePaths.SIGNIN} replace={true} />;
	}
};

export default DefaultPage;
