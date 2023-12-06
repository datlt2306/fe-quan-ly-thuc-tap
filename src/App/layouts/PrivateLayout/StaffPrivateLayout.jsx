import { StaffPaths } from '@/App/configs/route-paths.config';
import { UserRoleEnum } from '@/App/constants/userRoles';
import NotificationWithAction from '@/Core/components/common/Notifycation/NotificationWithAction';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const StaffPrivateLayout = ({ children }) => {
	const { hasRegisteredAppPassword, user } = useSelector((state) => state.auth);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		let timeout = null;
		if (hasRegisteredAppPassword === false) {
			timeout = setTimeout(() => setOpen(true), 500);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return user.role === UserRoleEnum.STAFF ? (
		<>
			{!user.hasRegisteredAppPassword && (
				<NotificationWithAction
					open={open}
					onOpenStateChange={setOpen}
					icon={BellAlertIcon}
					title='Lời nhắc'
					message='Bạn chưa cài đặt mật khẩu ứng dụng. Đi đến cài đặt ngay ?'
					okText='Đi đến cài đặt'
					dismissText='Để sau'
					onOk={() => {
						navigate(StaffPaths.SETTINGS);
					}}
				/>
			)}
			{children}
		</>
	) : (
		<Navigate to='/' replace={true} />
	);
};

export default StaffPrivateLayout;
