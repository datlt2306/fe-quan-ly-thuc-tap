import { UserRoleEnum } from "@/Core/constants/userRoles.enum";
import {
	CalendarIcon,
	DocumentArrowUpIcon,
	DocumentChartBarIcon,
	DocumentIcon,
	DocumentTextIcon,
	FolderIcon,
	HomeIcon,
	PaperClipIcon,
	ReceiptPercentIcon,
	UserIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";

export const studentNavigation = [
	{
		label: "Thông tin sinh viên",
		path: "/",
		icon: UserIcon,
	},
	{
		label: "Đăng ký thực tập",
		path: "/intern-registration",
		icon: DocumentArrowUpIcon,
	},
	{
		label: "Báo cáo",
		path: "/intern-report",
		icon: DocumentChartBarIcon,
	},
	{
		label: "Biên bản",
		path: "/intern-record",
		icon: DocumentTextIcon,
	},
];

export const staffNavigation = [
	{
		label: "Danh sách công ty",
		path: "/companies",
		icon: HomeIcon,
	},
	{
		label: "Reviews",
		path: "/reviews",
		icon: HomeIcon,
	},
	{
		label: "Kì học",
		path: "/semester",
		icon: HomeIcon,
	},
	{
		label: "Thời gian đăng kí",
		path: "/request-time",
		icon: HomeIcon,
	},
	{
		label: "Yêu cầu từ sinh viên",
		path: "/student-requests",
		icon: HomeIcon,
	},
];
