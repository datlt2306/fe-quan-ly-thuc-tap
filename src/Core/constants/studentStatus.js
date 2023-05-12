/**
 * @enum
 */
export const StudentStatusEnum = {
	0: "Chờ kiểm tra CV",
	1: "Sửa lại CV",
	2: "Nhận CV",
	3: "Không đủ điều kiện",
	4: "Đã nộp biên bản",
	5: "Sửa biên bản",
	6: "Đang thực tập",
	7: "Đã nộp báo cáo",
	8: "Sửa báo cáo",
	9: "Hoàn thành",
	10: "Chưa đăng ký",
};

export const StudentStatusGroup = {
	warning: [0, 1, 5, 7, 8],
	error: [3, 10],
	info: [2, 4, 6],
	success: [9],
};