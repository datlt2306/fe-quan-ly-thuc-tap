import { ManagerPaths } from "@/Core/constants/routePaths";
import ManagerPrivateLayout from "../layouts/PrivateLayout/ManagerPrivateLayout";
import { Suspense, lazy } from "react";
import LoadingProgressBar from "@/Core/components/common/Loading/LoadingProgressBar";

const StaffListPage = lazy(() => import("../pages/ManagerPages/StaffListPage"));
const CampusListPage = lazy(() => import("../pages/ManagerPages/CampusListPage"));
const MajorListPage = lazy(() => import("../pages/ManagerPages/MajorListPage"));
const SpecializationPage = lazy(() => import("../pages/ManagerPages/SpecializationPage"));

/**
 * @interface RouteObject
 * @param {RouteObject} RouteObject.path
 * @param {React.JSXElement} RouteObject.element
 */
const managerRoutes = [
	{
		path: ManagerPaths.STAFF_LIST,
		element: (
			<ManagerPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<StaffListPage />
				</Suspense>
			</ManagerPrivateLayout>
		),
	},
	{
		path: ManagerPaths.CAMPUS,
		element: (
			<ManagerPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<CampusListPage />
				</Suspense>
			</ManagerPrivateLayout>
		),
	},
	{
		path: ManagerPaths.MAJOR,
		element: (
			<ManagerPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<MajorListPage />
				</Suspense>
			</ManagerPrivateLayout>
		),
	},
	{
		path: ManagerPaths.SPECIALIZATION,
		element: (
			<ManagerPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<SpecializationPage />
				</Suspense>
			</ManagerPrivateLayout>
		),
	},
];

export default managerRoutes;
