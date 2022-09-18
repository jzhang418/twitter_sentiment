import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    initialized: false
};

const asyncSlice = createSlice({
    name: 'async',
    initialState,
    reducers: {
        appLoaded(state, action) {
            state.initialized = true;
        },
    }
})

export const { appLoaded } = asyncSlice.actions;

export default asyncSlice.reducer;