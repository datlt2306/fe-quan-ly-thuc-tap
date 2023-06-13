import { createSlice } from '@reduxjs/toolkit';
import semesterApi from '../apis/semesterApi';

const semesterSlice = createSlice({
	name: 'semester',
	initialState: {
		defaultSemester: null,
		listSemesters: []
	},
	reducers: {},
	extraReducers: (build) => {
		build.addMatcher(semesterApi.endpoints.getAllSemesters.matchFulfilled, (state, { payload }) => {
			return payload;
		});
	}
});

export default semesterSlice;
