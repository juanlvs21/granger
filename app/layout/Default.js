import React from "react";

// Components
import Navbar from "../components/core/Navbar";
import Footer from "../components/core/Footer";
import SessionModal from "../components/session/LoginModal";
import LogoutConfirmModal from "../components/session/LogoutConfirmModal";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="granger__layout-content">{children}</div>
      <Footer />
      {/* Modals */}
      <SessionModal />
      <LogoutConfirmModal />
    </>
  );
};

export default DefaultLayout;
