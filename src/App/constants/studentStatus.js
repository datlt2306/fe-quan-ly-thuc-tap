/**
 * @enum
 */
export const StudentStatusEnum = {
	0: 'Chờ kiểm tra CV',
	1: 'Sửa lại CV',
	2: 'Nhận CV',
	3: 'Không đủ điều kiện',
	4: 'Đã nộp biên bản',
	5: 'Sửa biên bản',
	6: 'Đang thực tập',
	7: 'Đã nộp báo cáo',
	8: 'Sửa báo cáo',
	9: 'Hoàn thành',
	10: 'Chưa đăng ký',
	11: 'Đã đăng ký',
	12: 'Không đạt'
};

/**
 * @enum
 */
export const StudentStatusGroupEnum = {
	warning: ['Chờ kiểm tra CV', 'Sửa lại CV', 'Sửa biên bản', 'Sửa báo cáo'],
	error: ['Không đủ điều kiện', 'Chưa đăng ký', 'Không đạt'],
	info: ['Nhận CV', 'Đã nộp biên bản', 'Đang thực tập', 'Đã nộp báo cáo', 'Đã đăng ký'],
	success: ['Hoàn thành']
};

/**
 * @enum
 */
export const StudentSchoolingStatus = {
	CHO: 'Chờ xếp lớp',
	HDI: 'Học đi',
	HL: 'Học lại',
	TN: 'Tốt nghiệp'
};

/**
 * @enum
 */
export const InternSupportType = {
	0: 'Tự tìm công ty',
	1: 'Nhờ nhà trường hỗ trợ'
};
