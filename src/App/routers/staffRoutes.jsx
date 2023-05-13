import { StaffPaths } from "@/Core/constants/routePaths";
import { lazy } from "react";
import StaffPrivateLayout from "../layouts/PrivateLayout/StaffPrivateLayout";
const ReviewPage = lazy(() => import("../pages/StaffPages/ReviewPage"));
const RegistrationPage = lazy(() => import("../pages/StudentPages/RegistrationPage"));
const StudentListPage = lazy(() => import("../pages/StaffPages/StudentListPage"));
const CompanyListPage = lazy(() => import("../pages/StaffPages/CompanyPages/CompanyListPage"));
const CompanyAddPage = lazy(() => import("../pages/StaffPages/CompanyPages/CompanyAddPage"));
const CompanyUpdatePage = lazy(() => import("../pages/StaffPages/CompanyPages/CompanyUpdatePage"));
const SemesterPage = lazy(() => import("../pages/StaffPages/SemesterPage"));
const StudentSuportPage = lazy(() => import("../pages/StaffPages/StudentSuportPage"));

const staffRoutes = [
	{
		path: StaffPaths.STUDENT_LIST,
		element: (
			<StaffPrivateLayout>
				<StudentListPage />	
			</StaffPrivateLayout>
		),
	},
	{
		path: StaffPaths.COMPANY_LIST,
		element: (
			<StaffPrivateLayout>
				<CompanyListPage />
			</StaffPrivateLayout>
		),
	},
	{
		path: StaffPaths.COMPANY_ADD,
		element: (
			<StaffPrivateLayout>
				<CompanyAddPage />
			</StaffPrivateLayout>
		),
	},
	{
		path: StaffPaths.COMPANY_UPDATE,
		element: (
			<StaffPrivateLayout>
				<CompanyUpdatePage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.REGISTRATION_TIME,
		element: (
			<StaffPrivateLayout>
				<RegistrationPage />
			</StaffPrivateLayout>
		),
	},
	{
		path: StaffPaths.REVIEWS,
		element: (
			<StaffPrivateLayout>
				<ReviewPage />
			</StaffPrivateLayout>
		),
	},
	{
		path: StaffPaths.SEMESTER,
		element: (
			<StaffPrivateLayout>
				<SemesterPage />
			</StaffPrivateLayout>
		),
	},
	{
		path: StaffPaths.STUDENT_REQUESTS,
		element: (
			<StaffPrivateLayout>
				<StudentSuportPage />
			</StaffPrivateLayout>
		),
	},
];

export default staffRoutes;
