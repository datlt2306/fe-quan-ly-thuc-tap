import { StaffPaths } from '@/Core/constants/routePaths';
import { lazy } from 'react';
import StaffPrivateLayout from '../layouts/PrivateLayout/StaffPrivateLayout';
const ReviewCvPage = lazy(() => import('../pages/StaffPages/ReviewsPage/ReviewCvPage'));
const ReviewReportPage = lazy(() => import('../pages/StaffPages/ReviewsPage/ReviewReportPage'));
const ReviewRecordPage = lazy(() => import('../pages/StaffPages/ReviewsPage/ReviewRecordPage'));
const RegistrantionPage = lazy(() => import('../pages/StaffPages/RegistrantionTimePage'));
const StudentListPage = lazy(() => import('../pages/StaffPages/StudentListPage'));
const CompanyListPage = lazy(() => import('../pages/StaffPages/CompanyPages/CompanyListPage'));
const CompanyAddPage = lazy(() => import('../pages/StaffPages/CompanyPages/CompanyAddPage'));
const CompanyUpdatePage = lazy(() => import('../pages/StaffPages/CompanyPages/CompanyUpdatePage'));
const SemesterPage = lazy(() => import('../pages/StaffPages/SemesterPage'));
const StudentSuportPage = lazy(() => import('../pages/StaffPages/StudentSuportPage'));

const staffRoutes = [
	{
		path: StaffPaths.STUDENT_LIST,
		element: (
			<StaffPrivateLayout>
				<StudentListPage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.COMPANY_LIST,
		element: (
			<StaffPrivateLayout>
				<CompanyListPage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.COMPANY_ADD,
		element: (
			<StaffPrivateLayout>
				<CompanyAddPage />
			</StaffPrivateLayout>
		)
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
				<RegistrantionPage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.REVIEW_CV,
		element: (
			<StaffPrivateLayout>
				<ReviewCvPage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.REVIEW_REPORT,
		element: (
			<StaffPrivateLayout>
				<ReviewReportPage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.REVIEW_RECORD,
		element: (
			<StaffPrivateLayout>
				<ReviewRecordPage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.SEMESTER,
		element: (
			<StaffPrivateLayout>
				<SemesterPage />
			</StaffPrivateLayout>
		)
	},
	{
		path: StaffPaths.STUDENT_REQUESTS,
		element: (
			<StaffPrivateLayout>
				<StudentSuportPage />
			</StaffPrivateLayout>
		)
	}
];

export default staffRoutes;
