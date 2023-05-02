import { StudentPaths } from "@/Core/constants/routePaths";
import StudentPrivateLayout from "../layouts/PrivateLayout/StudentPrivateLayout";
import { Suspense, lazy } from "react";
import LoadingProgressBar from "@/Core/components/common/Loading/LoadingProgressBar";
const RecordPage = lazy(() => import("../pages/StudentPages/RecordPage"));
const RegistrationPage = lazy(() => import("../pages/StudentPages/RegistrationPage"));
const ReportPage = lazy(() => import("../pages/StudentPages/ReportPage"));
const StudentInfoPage = lazy(() => import("../pages/StudentPages/StudentInfoPage"));

/**
 * @interface RouteObject
 * @property {string} path
 * @property {React.JSXElement} element
 */
const studentRoutes = [
	{
		path: StudentPaths.STUDENT_INFO,
		element: (
			<StudentPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<StudentInfoPage />
				</Suspense>
			</StudentPrivateLayout>
		),
	},
	{
		path: StudentPaths.REGISTRATION,
		element: (
			<StudentPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<RegistrationPage />
				</Suspense>
			</StudentPrivateLayout>
		),
	},
	{
		path: StudentPaths.REPORT,
		element: (
			<StudentPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<ReportPage />
				</Suspense>
			</StudentPrivateLayout>
		),
	},
	{
		path: StudentPaths.RECORD,
		element: (
			<StudentPrivateLayout>
				<Suspense fallback={<LoadingProgressBar />}>
					<RecordPage />
				</Suspense>
			</StudentPrivateLayout>
		),
	},
];
export default studentRoutes;
