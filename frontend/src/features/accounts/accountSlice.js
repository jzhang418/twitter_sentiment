import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    accounts: [],
    error: null
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
            return error.message
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

export const { createAccount, asyncActionStart, asyncActionFinish, asyncActionError } = accountSlice.actions

export default accountSlice.reducer

