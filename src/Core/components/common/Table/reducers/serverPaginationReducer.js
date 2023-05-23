/**
 * @enum
 */
export const PaginationActionEnums = {
	GO_TO_NEXT_PAGE: 'GO_TO_NEXT_PAGE',
	GO_TO_PREV_PAGE: 'GO_TO_PREV_PAGE',
	GO_TO_FIRST_PAGE: 'GO_TO_FIRST_PAGE',
	GO_TO_LAST_PAGE: 'GO_TO_LAST_PAGE',
	CHANGE_PAGE_SIZE: 'CHANGE_PAGE_SIZE'
};

export const paginationInitialState = {
	pageIndex: 1,
	pageSize: 10
};

export const paginationReducer = (state, action) => {
	switch (action.type) {
		case PaginationActionEnums.GO_TO_NEXT_PAGE:
			return { ...state, pageIndex: state.pageIndex + 1 };
		case PaginationActionEnums.GO_TO_PREV_PAGE:
			return { ...state, pageIndex: state.pageIndex - 1 };
		case PaginationActionEnums.GO_TO_FIRST_PAGE:
			return { ...state, pageIndex: 1 };
		case PaginationActionEnums.GO_TO_LAST_PAGE:
			return { ...state, pageIndex: action.payload };
		case PaginationActionEnums.CHANGE_PAGE_SIZE:
			return { ...state, pageSize: action.payload };
	}
};
