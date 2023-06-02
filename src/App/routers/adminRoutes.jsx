import { AdminPaths } from '@/Core/constants/routePaths';
import { lazy } from 'react';
import AdminPrivateLayout from '../layouts/PrivateLayout/AdminPrivateLayout';

const ManagerListPage = lazy(() => import('../pages/AdminPages/ManagerListPage'));
const CampusListPage = lazy(() => import('../pages/AdminPages/CampusListPage'));

const adminRoutes = [
	{
		path: AdminPaths.MANAGER_LIST,
		element: (
			<AdminPrivateLayout>
				<ManagerListPage />
			</AdminPrivateLayout>
		)
	},
	{
		path: AdminPaths.CAMPUS,
		element: (
			<AdminPrivateLayout>
				<CampusListPage />
			</AdminPrivateLayout>
		)
	}
];

export default adminRoutes;
