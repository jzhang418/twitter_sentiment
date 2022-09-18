import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticated: false,
    currentUser: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signInUser(state, action) {
            state.authenticated = true;
            state.currentUser = {
                email: action.payload.email,
                photoURL: action.payload.photoURL,
                uid: action.payload.uid,
                displayName: action.payload.displayName,
                providerId: action.payload.providerData[0].providerId,
            };
        },
        signOutUser(state, action) {
            state.authenticated = false;
            state.currentUser = null;
        }
    }
})

export const { signInUser, signOutUser } = authSlice.actions;

export default authSlice.reducer;