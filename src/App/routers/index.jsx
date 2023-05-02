import { Navigate, useRoutes } from "react-router-dom";
import SigninPage from "../pages/Signin";
import PrivateLayout from "../layouts/PrivateLayout";
import MainLayout from "../layouts/MainLayout";
import DefaultPage from "../pages";
import NotFoundPage from "../pages/404";
import studentRoutes from "./studentRoutes";
import managerRoutes from "./managerRoutes";
import staffRoutes from "./staffRoutes";
import { BasePaths } from "@/Core/constants/routePaths";

const routes = [
	{
		path: "*",
		element: <Navigate to={BasePaths.NOT_FOUND} replace={true} />,
	},
	{
		path: BasePaths.NOT_FOUND,
		element: <NotFoundPage />,
	},
	{
		path: BasePaths.SIGNIN,
		element: <SigninPage />,
	},

	{
		path: "/",
		element: (
			<PrivateLayout>
				<MainLayout />
			</PrivateLayout>
		),
		children: [
			{
				index: true,
				element: <DefaultPage />,
			},
			...studentRoutes,
			...staffRoutes,
			...managerRoutes,
		],
	},
];

export default function AppRoutes() {
	return useRoutes(routes);
}
