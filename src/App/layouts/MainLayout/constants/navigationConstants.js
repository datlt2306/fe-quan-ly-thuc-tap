import { ManagerPaths, StaffPaths, StudentPaths } from '@/Core/constants/routePaths';
import {
	AcademicCapIcon,
	BookOpenIcon,
	BuildingOffice2Icon,
	CalendarDaysIcon,
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
	ClockIcon,
	DocumentChartBarIcon,
	DocumentCheckIcon,
	DocumentIcon,
	DocumentTextIcon,
	EnvelopeOpenIcon,
	InformationCircleIcon,
	ListBulletIcon,
	PlusIcon,
	PlusSmallIcon,
	UserGroupIcon,
	UserIcon
} from '@heroicons/react/24/outline';

export const studentNavigation = [
	{
		name: 'Thông tin sinh viên',
		path: StudentPaths.STUDENT_INFO,
		icon: UserIcon
	},
	{
		name: 'Thông tin tuyển dụng',
		path: StudentPaths.COMPANY_LIST,
		icon: InformationCircleIcon
	},
	{
		name: 'Đăng ký thực tập',
		path: StudentPaths.REGISTRATION,
		icon: PlusIcon
	},
	{
		name: 'Biên bản',
		path: StudentPaths.RECORD,
		icon: DocumentTextIcon
	},
	{
		name: 'Báo cáo',
		path: StudentPaths.REPORT,
		icon: DocumentChartBarIcon
	}
];

export const staffNavigation = [
	{
		name: 'Danh sách sinh viên',
		path: StaffPaths.STUDENT_LIST,
		icon: UserGroupIcon
	},
	{
		name: 'Công ty',
		icon: BuildingOffice2Icon,
		children: [
			{
				name: 'Danh sách công ty',
				path: StaffPaths.COMPANY_LIST,
				icon: ClipboardDocumentIcon,
				show: true
			},
			{
				name: 'Thêm mới công ty',
				path: StaffPaths.COMPANY_ADD,
				icon: PlusIcon,
				show: true
			},
			{
				name: 'Cập nhật công ty',
				path: StaffPaths.COMPANY_UPDATE,
				icon: UserGroupIcon
			}
		]
	},
	{
		name: 'Reviews',
		icon: ClipboardDocumentCheckIcon,
		children: [
			{
				name: 'Review CV',
				path: StaffPaths.REVIEW_CV,
				icon: DocumentCheckIcon,
				show: true
			},
			{
				name: 'Review biên bản',
				path: StaffPaths.REVIEW_RECORD,
				icon: DocumentTextIcon,
				show: true
			},
			{
				name: 'Review báo cáo',
				path: StaffPaths.REVIEW_REPORT,
				icon: DocumentChartBarIcon,
				show: true
			}
		]
	},
	{
		name: 'Kì học',
		icon: CalendarDaysIcon,
		path: StaffPaths.SEMESTER
	},
	{
		name: 'Thời gian đăng kí',
		path: StaffPaths.REGISTRATION_TIME,
		icon: ClockIcon
	},
	{
		name: 'Yêu cầu từ sinh viên',
		path: StaffPaths.STUDENT_REQUESTS,
		icon: EnvelopeOpenIcon
	}
];

export const managerNavigation = [
	{
		name: 'Danh sách nhân viên',
		path: ManagerPaths.STAFF_LIST,
		icon: UserGroupIcon
	},
	{
		name: 'Danh sách cơ sở',
		path: ManagerPaths.CAMPUS,
		icon: BuildingOffice2Icon
	},
	{
		name: 'Ngành học',
		path: ManagerPaths.MAJOR,
		icon: AcademicCapIcon
	},
	{
		name: 'Ngành hẹp',
		path: ManagerPaths.SPECIALIZATION,
		icon: BookOpenIcon
	}
];
