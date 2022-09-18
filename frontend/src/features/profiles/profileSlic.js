import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    currentUserProfile: null,
    error: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        listenToProfile(state, action) {
            state.currentUserProfile = action.payload;
        },
        asyncActionStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        asyncActionFinish: (state) => {
            state.loading = false;
        },
        asyncActionError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { listenToProfile, asyncActionStart, asyncActionFinish, asyncActionError } = profileSlice.actions;

export default profileSlice.reducer;