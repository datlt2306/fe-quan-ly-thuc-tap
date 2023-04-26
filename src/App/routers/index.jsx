import { useRoutes } from 'react-router-dom';
import SigninPage from '../pages/Signin';
import PrivateLayout from '../layouts/PrivateLayout';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';

const routes = [
	{
		path: '*',
		element: <div>Not found</div>,
	},
	{
		path: '/signin',
		element: <SigninPage />,
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
				element: <HomePage />,
			},
		],
	},
];

export default function AppRoutes() {
	console.log('router is running!');
	return useRoutes(routes);
}
