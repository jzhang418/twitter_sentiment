import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSampleData } from "../../app/api/mockApi";

const initialState = {
    loading: false,
    accounts: [],
    error: null
}

export const fetchAccounts = createAsyncThunk('account/fetchAccounts', () => {
    return fetchSampleData()
})

const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {   
        listenToAccounts: (state, action) => {
            state.accounts = action.payload
        },
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
    extraReducers: (builder) => {
        builder.addCase(fetchAccounts.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchAccounts.fulfilled, (state, action) => {
            state.loading = false;
            state.accounts = action.payload;
            state.error = null;
        })
        builder.addCase(fetchAccounts.rejected, (state, action) => {
            state.loading = false;
            state.accounts = [];
            state.error = {message: action.error.message};
        })
    }
})

export const { listenToAccounts, createAccount, asyncActionStart, asyncActionFinish, asyncActionError } = accountSlice.actions

export default accountSlice.reducer

