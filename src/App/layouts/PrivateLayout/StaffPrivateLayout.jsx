import { UserRoleEnum } from '@/App/constants/userRoles';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const StaffPrivateLayout = ({ children }) => {
	const user = useSelector((state) => state.auth?.user);
	return user.role === UserRoleEnum.STAFF ? children : <Navigate to='/' replace={true} />;
};

export default StaffPrivateLayout;
