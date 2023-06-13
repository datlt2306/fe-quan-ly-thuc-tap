import { createSlice } from '@reduxjs/toolkit';
import campusApi from '../apis/campusApi';

const campusSlice = createSlice({
	name: 'campus',
	initialState: {
		currentCampus: null,
		campusList: []
	},
	reducers: {
		getCurrentCampus: (state, { payload }) => {
			state.currentCampus = payload;
		}
	},
	extraReducers: (build) => {
		build.addMatcher(campusApi.endpoints.getAllCampus.matchFulfilled, (state, { payload }) => {
			state.campusList = payload;
		});
	}
});

export const { getCurrentCampus } = campusSlice.actions;
export default campusSlice;
