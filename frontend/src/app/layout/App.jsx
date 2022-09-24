import { Route, Routes } from "react-router-dom";
import { Container } from "semantic-ui-react";
import HomePage from "../../features/home/HomePage";
import AccountDashboard from "../../features/accounts/accountDashboard/AccountDashboard";
import AccountDetail from "../..//features/accounts/accountDetail/AccontDetail";
import NavBar from "../../features/nav/NavBar";
import ModalManager from "../common/modals/ModalManager";
import { ToastContainer } from "react-toastify";
import ErrorComponent from "../common/errors/ErrorComponent";
import ChangePasswordPage from "../../features/auth/ChangePasswordPage";
import ProfilePage from "../../features/profiles/profilePage/ProfilePage";

function App() {
  
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
