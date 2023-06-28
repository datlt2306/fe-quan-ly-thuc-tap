import { BasePaths } from '@/App/configs/routePaths';
import { Navigate, RouterProvider, createBrowserRouter, useRoutes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import DefaultPage from '../pages';
import NotFoundPage from '../pages/404';
import SigninPage from '../pages/Auth/SigninPage';
import adminRoutes from './adminRoutes';
import managerRoutes from './managerRoutes';
import staffRoutes from './staffRoutes';
import studentRoutes from './studentRoutes';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';

export default function Routers() {
	const routes = createBrowserRouter([
		{
			path: '*',
			element: <Navigate to={BasePaths.NOT_FOUND} replace={true} />
		},
		{
			path: BasePaths.NOT_FOUND,
			element: <NotFoundPage />
		},
		{
			path: BasePaths.SIGNIN,
			element: <SigninPage />
		},
		{
			path: '/',
			element: (
				<PrivateLayout>
					<MainLayout />
				</PrivateLayout>
			),
			children: [
				{
					index: true,
					element: <DefaultPage />
				},
				...studentRoutes,
				...staffRoutes,
				...managerRoutes,
				...adminRoutes
			]
		}
	]);
	return <RouterProvider router={routes} fallbackElement={<LoadingProgressBar />} />;
}
