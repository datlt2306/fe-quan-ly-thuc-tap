import { UserRoleEnum } from "@/Core/constants/userRoles";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const StudentPrivateLayout = ({ children }) => {
	const user = useSelector((state) => state.auth?.user);
	return user.role === UserRoleEnum.STUDENT ? children : <Navigate to="/" replace={true} />;
};

export default StudentPrivateLayout;
