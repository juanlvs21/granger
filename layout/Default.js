import React from "react";

// Components
import Navbar from "../components/core/Navbar";
import SessionModal from "../components/session/LoginModal";
import LogoutConfirmModal from "../components/session/LogoutConfirmModal";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="book__layout-content">{children}</div>
      {/* Modals */}
      <SessionModal />
      <LogoutConfirmModal />
    </>
  );
};

export default DefaultLayout;
