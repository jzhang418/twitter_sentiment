import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    authenticated: false,
    currentUser: null,
    error: null
};

export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async (creds, { rejectWithValue }) => {
        try {
            const config = {
                Headers: {
                    'Content-Type': 'application/json',
                }  
            }

            const {data} = await axios.post(
                '/api/users/login/',
                {'username': creds.username, 'password': creds.password},
                config
            )

            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (creds, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }  
            }

            const {data} = await axios.post(
                '/api/users/register/',
                {'username': creds.username, 'email': creds.email, 'password': creds.password, 'twitter_id': creds.twitter_id},
                config
            )

            return data
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signOutUser(state, action) {
            state.authenticated = false;
            state.currentUser = null;
        }
    },
    extraReducers: {
        // login
        [signInUser.pending]: (state) => {
            state.authenticated = false;
        },
        [signInUser.fulfilled]: (state, action) => {
            state.authenticated = true;
            state.currentUser = action.payload;
            state.error = null;
        },
        [signInUser.rejected]: (state, action) => {
            state.authenticated = false;
            state.currentUser = null;
            state.error = action.payload;
        },
        // register
        [registerUser.pending]: (state) => {
            state.authenticated = false;
        },
        [registerUser.fulfilled]: (state, action) => {
            state.authenticated = true;
            state.currentUser = action.payload;
            state.error = null;
        },
        [registerUser.rejected]: (state, action) => {
            state.authenticated = false;
            state.currentUser = null;
            state.error = action.payload;
        },
    }
})

export const { signOutUser } = authSlice.actions;

export default authSlice.reducer;