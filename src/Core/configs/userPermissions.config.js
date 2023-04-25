/**
 * @enum {UserRoleEnum}
 */
export const UserRoleEnum = {
	STUDENT: 'STUDENT',
	MANAGER: 'MANAGER',
	STAFF: 'STAFF',
	BUSSINESS: 'BUSSINESS',
};

/**
 * @enum {UserActionsEnum}
 */
export const UserActionsEnum = {
	GET: 'GET',
	CREATE: 'CREATE',
	UPDATE: 'UPDATE',
	DELETE: 'DELETE',
	UPLOAD: 'UPLOAD',
};

export const studentPermission = {
	role: UserRoleEnum.STUDENT,
	permissions: [
		{
			type: 'CV',
			allowedActions: [],
		},
	],
};

export const managerPermission = {
	role: UserRoleEnum.MANAGER,
	permissions: [],
};
