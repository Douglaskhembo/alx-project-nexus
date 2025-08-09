import { useState } from "react";
import LoginModal from "./LoginModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import RegisterModal from "./RegisterModal";


export default function AuthModalsManager() {
  const [modal, setModal] = useState<"login" | "forgotPassword" | "register" | null>("login");

  const closeModal = () => setModal(null);
  const openLogin = () => setModal("login");
  const openForgotPassword = () => setModal("forgotPassword");
  const openRegister = () => setModal("register");

  return (
    <>
      {modal === "login" && (
        <LoginModal
          onClose={closeModal}
          onSwitchToRegister={openRegister}
          onSwitchToForgotPassword={openForgotPassword}
        />
      )}
      {modal === "forgotPassword" && (
        <ForgotPasswordModal
          onClose={closeModal}
          onSwitchToLogin={openLogin}
        />
      )}
      {modal === "register" && (
        <RegisterModal
          onClose={closeModal}
          onSwitchToLogin={openLogin}
        />
      )}
    </>
  );
}
