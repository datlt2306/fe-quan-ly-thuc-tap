import { UserRoleEnum } from '@/App/constants/userRoles';
import { useSelector } from 'react-redux';

export const StaffPrivateComponent = ({ children }) => {
	const user = useSelector((state) => state.auth.user);
	return user.role === UserRoleEnum.STAFF && children;
};
