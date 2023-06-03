import { ManagerPaths } from '@/Core/constants/routePaths';
import { lazy } from 'react';
import ManagerPrivateLayout from '../layouts/PrivateLayout/ManagerPrivateLayout';

const StaffListPage = lazy(() => import('../pages/ManagerPages/StaffListPage'));
const MajorListPage = lazy(() => import('../pages/ManagerPages/MajorListPage'));

const managerRoutes = [
	{
		path: ManagerPaths.STAFF_LIST,
		element: (
			<ManagerPrivateLayout>
				<StaffListPage />
			</ManagerPrivateLayout>
		)
	},
	{
		path: ManagerPaths.MAJOR,
		element: (
			<ManagerPrivateLayout>
				<MajorListPage />
			</ManagerPrivateLayout>
		)
	}
];

export default managerRoutes;
