import { BasePaths } from "@/Core/constants/routePaths";
import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import DefaultPage from "../pages";
import NotFoundPage from "../pages/404";
import SigninPage from "../pages/Signin";
import managerRoutes from "./managerRoutes";
import staffRoutes from "./staffRoutes";
import studentRoutes from "./studentRoutes";

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
