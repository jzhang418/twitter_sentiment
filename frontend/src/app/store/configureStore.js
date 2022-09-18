import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../../features/accounts/accountSlice";
import modalReducer from "../../app/common/modals/modalSlice";
import authReducer from "../../features/auth/authSlice";
import asyncReducer from "../../app/async/asyncSlice";
import profileReducer from "../../features/profiles/profileSlic";

export const store = configureStore({
    reducer: {
        account: accountReducer,
        modals: modalReducer,
        auth: authReducer,
        async: asyncReducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})
