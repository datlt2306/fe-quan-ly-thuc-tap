import { BasePaths } from '@/Core/constants/routePaths';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateLayout = ({ children }) => {
	const isSignedIn = useSelector((state) => state.auth?.isSignedIn);
	return isSignedIn ? children : <Navigate to={BasePaths.SIGNIN} replace={true} />;
};

export default PrivateLayout;
