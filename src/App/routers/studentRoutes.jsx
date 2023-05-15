import { StudentPaths } from "@/Core/constants/routePaths";
import { lazy } from "react";
import StudentPrivateLayout from "../layouts/PrivateLayout/StudentPrivateLayout";
const RecordPage = lazy(() => import("../pages/StudentPages/RecordPage/RecordPage"));
const RegistrationPage = lazy(() => import("../pages/StudentPages/RegistrationPage"));
const ReportPage = lazy(() => import("../pages/StudentPages/ReportPage"));
const StudentInfoPage = lazy(() => import("../pages/StudentPages/StudentInfoPage"));

const studentRoutes = [
	{
		path: StudentPaths.STUDENT_INFO,
		element: (
			<StudentPrivateLayout>
				<StudentInfoPage />
			</StudentPrivateLayout>
		),
	},
	{
		path: StudentPaths.REGISTRATION,
		element: (
			<StudentPrivateLayout>
				<RegistrationPage />
			</StudentPrivateLayout>
		),
	},
	{
		path: StudentPaths.REPORT,
		element: (
			<StudentPrivateLayout>
				<ReportPage />
			</StudentPrivateLayout>
		),
	},
	{
		path: StudentPaths.RECORD,
		element: (
			<StudentPrivateLayout>
				<RecordPage />
			</StudentPrivateLayout>
		),
	},
];
export default studentRoutes;
