import { StaffPaths } from "@/Core/constants/routePaths";
import StaffPrivateLayout from "../layouts/PrivateLayout/StaffPrivateLayout";
import { Suspense, lazy } from "react";
import LoadingProgressBar from "@/Core/components/common/Loading/LoadingProgressBar";
const StudentListPage = lazy(() => import("../pages/StaffPages/StudentListPage"));
const CompanyListPage = lazy(() => import("../pages/StaffPages/CompanyListPage"));

/**
 * @interface RouteObject
 * @param {RouteObject} RouteObject.path
 * @param {React.JSXElement} RouteObject.element
 */
const staffRoutes = [
	{
		path: StaffPaths.STUDENT_LIST,
		element: (
			<StaffPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<StudentListPage />
				</Suspense>
			</StaffPrivateLayout>
		),
	},
	{
		path: StaffPaths.COMPANY_LIST,
		element: (
			<StaffPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<CompanyListPage />
				</Suspense>
			</StaffPrivateLayout>
		),
	},
];

export default staffRoutes;
