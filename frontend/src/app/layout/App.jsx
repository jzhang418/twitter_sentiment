import { Route, Routes } from "react-router-dom";
import { Container } from "semantic-ui-react";
import HomePage from "../../features/home/HomePage";
import AccountDashboard from "../../features/accounts/accountDashboard/AccountDashboard";
import AccountDetail from "../..//features/accounts/accountDetail/AccontDetail";
import NavBar from "../../features/nav/NavBar";
import ModalManager from "../common/modals/ModalManager";
import { ToastContainer } from "react-toastify";
import ErrorComponent from "../common/errors/ErrorComponent";
import { useEffect } from "react";
import firebase from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { signInUser, signOutUser } from "../../features/auth/authSlice";
import ChangePasswordPage from "../../features/auth/ChangePasswordPage";
import { appLoaded } from "../async/asyncSlice";
import LoadingComponent from "./LoadingComponent";
import ProfilePage from "../../features/profiles/profilePage/ProfilePage";

function App() {
  const dispatch = useDispatch();
  const {initialized} = useSelector(state => state.async);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
          dispatch(signInUser(user));
          dispatch(appLoaded());
      } else {
          dispatch(signOutUser());
          dispatch(appLoaded());
      }
  })
  }, [dispatch]);

  if (!initialized) return <LoadingComponent content="Loading App..." />

  return (
    <>
      <ModalManager />
      <ToastContainer position="bottom-right" hideProgressBar />
      <NavBar />
      <Container className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accounts" element={<AccountDashboard />} />
          <Route path="/accounts/:id" element={<AccountDetail />} />
          <Route path="/changepassword" element={<ChangePasswordPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/error" element={<ErrorComponent />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
