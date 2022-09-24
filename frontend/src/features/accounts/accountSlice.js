import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    checkBotLoading: false,
    accounts: [],
    error: null,
    checkBotError: null,
}

export const fetchAccounts = createAsyncThunk(
    'account/fetchAccounts', 
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: {currentUser} } = getState();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                }  
            }

            const {data} = await axios.get('/api/accounts/', config)

            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const checkBot = createAsyncThunk(
    "account/checkBot", 
    async (username, { rejectWithValue }) => {
        try {
        const { data } = await axios.get(`/api/accounts/checkbot/${username}`);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)
  

const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {   
        createAccount: (state, action) => {
            state.push(action.payload)
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
    },
    extraReducers: {
        [fetchAccounts.pending]: (state) => {
            state.loading = true;
        },
        [fetchAccounts.fulfilled]: (state, action) => {
            state.loading = false;
            state.accounts = action.payload;
            state.error = null;
        },
        [fetchAccounts.rejected]: (state, action) => {
            state.loading = false;
            state.accounts = [];
            state.error = action.payload;
        },
        [checkBot.pending]: (state) => {
            state.checkBotLoading = true;
        },
        [checkBot.fulfilled]: (state, action) => {
            state.checkBotLoading = false;
            const {username, isBot} = action.payload;
            const account = state.accounts.find((account) => account.username === username)
            if (account ) {
                account.isBot = isBot;
            }
            state.checkBotError = null;
        },
        [checkBot.rejected]: (state, action) => {
            state.checkBotLoading = false;
            state.checkBotError = action.payload;
        },
    }
})

export const { createAccount, asyncActionStart, asyncActionFinish, asyncActionError } = accountSlice.actions

export default accountSlice.reducer

