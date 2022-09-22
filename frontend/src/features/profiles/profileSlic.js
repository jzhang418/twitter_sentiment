import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    loading: false,
    currentUserProfile: null,
    error: null
};

export const getUserProfile = createAsyncThunk(
    'auth/getUserProfile',
    async (id, { getState }) => {
        try {
            const { auth: {currentUser} } = getState();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                }  
            }

            const {data} = await axios.get(
                `/api/users/${id}/`,
                config
            )

            return data
        } catch (error) {
            return error.message;
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (creds, { getState, rejectWithValue }) => {
        try {
            const { auth: {currentUser} } = getState();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                }  
            }

            const {data} = await axios.put(
                '/api/users/profile/update/',
                {'username': creds.username, 'email': creds.email, 'password': creds.password, 'twitter_id': creds.twitter_id},
                config
            )

            return data
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getUserProfile.pending]: (state) => {
            state.loading = true;
        },
        [getUserProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.currentUserProfile = action.payload;
            state.error = null;
        },
        [getUserProfile.rejected]: (state, action) => {
            state.loading = false;
            state.currentUserProfile = null;
            state.error = action.payload;
        },
        [updateUserProfile.pending]: (state) => {
            state.loading = true;
        },
        [updateUserProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.currentUserProfile = action.payload;
            state.error = null;
            toast.success('Profile has been updated');
            
        },
        [updateUserProfile.rejected]: (state, action) => {
            state.loading = false;
            state.currentUserProfile = null;
            state.error = action.payload;
        },
    }
})

export const { listenToProfile, asyncActionStart, asyncActionFinish, asyncActionError } = profileSlice.actions;

export default profileSlice.reducer;