const getPaginationIndex = (pageSize, pageIndex, index) => {
	return (pageIndex - 1) * pageSize + index + 1;
};

export default getPaginationIndex;
