/**
 * @enum
 */
const BasePaths = {
	NOT_FOUND: '/404',
	SIGNIN: '/signin'
};

/**
 * @enum
 */
const StudentPaths = {
	STUDENT_INFO: '/thong-tin-sinh-vien',
	REGISTRATION: '/dang-ky-thuc-tap',
	REPORT: '/bao-cao-thuc-tap',
	RECORD: '/bien-ban-thuc-tap',
	COMPANY_LIST: '/thong-tin-tuyen-dung'
};

/**
 * @enum
 */
const ManagerPaths = {
	STAFF_LIST: '/danh-sach-nhan-vien',
	CAMPUS: '/co-so',
	MAJOR: '/nganh-hoc',
	SPECIALIZATION: '/nganh-hep'
};

/**
 * @enum
 */
const StaffPaths = {
	COMPANY_LIST: '/danh-sach-cong-ty',
	COMPANY_ADD: '/them-moi-cong-ty',
	COMPANY_UPDATE: '/cap-nhat-cong-ty/:id',
	STUDENT_LIST: '/danh-sach-sinh-vien',
	REVIEW_CV: '/review-cv',
	REVIEW_REPORT: '/review-bao-cao',
	REVIEW_RECORD: '/review-bien-ban',
	SEMESTER: '/ky-hoc',
	REGISTRATION_TIME: '/thoi-gian-dang-ky',
	STUDENT_REQUESTS: '/yeu-cau-sinh-vien'
};

export { BasePaths, StudentPaths, StaffPaths, ManagerPaths };
