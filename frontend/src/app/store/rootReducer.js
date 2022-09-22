import { combineReducers } from "redux";
import accountReducer from "../../features/accounts/accountSlice";
import accountDetailReducer from "../../features/accounts/accountDetail/accountDetailSlice";
import modalReducer from "../../app/common/modals/modalSlice";
import authReducer from "../../features/auth/authSlice";
import asyncReducer from "../../app/async/asyncSlice";
import profileReducer from "../../features/profiles/profileSlic";

const rootReducer = combineReducers({
  account: accountReducer,
  accountdetail: accountDetailReducer,
  modals: modalReducer,
  auth: authReducer,
  async: asyncReducer,
  profile: profileReducer,
});

export default rootReducer;
