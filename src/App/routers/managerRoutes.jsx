import { ManagerPaths } from '@/Core/constants/routePaths';
import { lazy } from 'react';
import ManagerPrivateLayout from '../layouts/PrivateLayout/ManagerPrivateLayout';

const StaffListPage = lazy(() => import('../pages/ManagerPages/StaffListPage'));
const CampusListPage = lazy(() => import('../pages/ManagerPages/CampusListPage'));
const MajorListPage = lazy(() => import('../pages/ManagerPages/MajorListPage'));
const SpecializationPage = lazy(() => import('../pages/ManagerPages/SpecializationPage'));

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
		path: ManagerPaths.CAMPUS,
		element: (
			<ManagerPrivateLayout>
				<CampusListPage />
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
	},
	{
		path: ManagerPaths.SPECIALIZATION,
		element: (
			<ManagerPrivateLayout>
				<SpecializationPage />
			</ManagerPrivateLayout>
		)
	}
];

export default managerRoutes;
