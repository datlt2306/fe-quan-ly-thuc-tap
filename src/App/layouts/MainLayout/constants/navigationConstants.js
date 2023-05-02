import { ManagerPaths, StaffPaths, StudentPaths } from "@/Core/constants/routePaths";
import {
	AcademicCapIcon,
	BookOpenIcon,
	BuildingOffice2Icon,
	CalendarDaysIcon,
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
	ClockIcon,
	DocumentChartBarIcon,
	DocumentTextIcon,
	EnvelopeOpenIcon,
	ListBulletIcon,
	PlusIcon,
	PlusSmallIcon,
	UserGroupIcon,
	UserIcon,
} from "@heroicons/react/24/outline";

export const studentNavigation = [
	{
		label: "Thông tin sinh viên",
		path: StudentPaths.STUDENT_INFO,
		icon: UserIcon,
	},
	{
		label: "Đăng ký thực tập",
		path: StudentPaths.REGISTRATION,
		icon: PlusIcon,
	},
	{
		label: "Báo cáo",
		path: StudentPaths.REPORT,
		icon: DocumentChartBarIcon,
	},
	{
		label: "Biên bản",
		path: StudentPaths.RECORD,
		icon: DocumentTextIcon,
	},
];

export const staffNavigation = [
	{
		label: "Danh sách sinh viên",
		path: StaffPaths.STUDENT_LIST,
		icon: UserGroupIcon,
	},
	{
		label: "Danh sách công ty",
		path: StaffPaths.COMPANY_LIST,
		icon: ClipboardDocumentIcon,
	},
	{
		label: "Reviews",
		path: StaffPaths.REVIEWS,
		icon: ClipboardDocumentCheckIcon,
	},
	{
		label: "Kì học",
		icon: CalendarDaysIcon,
		path: StaffPaths.SEMESTER,
		children: [
			{
				label: "Danh sách kỳ học",
				icon: ListBulletIcon,
				path: "/semester",
			},
			{
				label: "Tạo mới",
				icon: PlusSmallIcon,
				path: "/semester/create",
			},
		],
	},
	{
		label: "Thời gian đăng kí",
		path: StaffPaths.REGISTRATION_TIME,
		icon: ClockIcon,
	},
	{
		label: "Yêu cầu từ sinh viên",
		path: "/student-requests",
		icon: EnvelopeOpenIcon,
	},
];

export const managerNavigation = [
	{
		label: "Danh sách nhân viên",
		path: ManagerPaths.STAFF_LIST,
		icon: UserGroupIcon,
	},
	{
		label: "Danh sách cơ sở",
		path: ManagerPaths.CAMPUS,
		icon: BuildingOffice2Icon,
	},
	{
		label: "Ngành học",
		path: ManagerPaths.MAJOR,
		icon: AcademicCapIcon,
	},
	{
		label: "Ngành hẹp",
		path: ManagerPaths.SPECIALIZATION,
		icon: BookOpenIcon,
	},
];
