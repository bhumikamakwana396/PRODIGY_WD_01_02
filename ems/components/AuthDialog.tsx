"use client";

import { useState } from "react";
import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";

export default function AuthDialogs() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <>
      <LoginDialog
        open={loginOpen}
        setOpen={setLoginOpen}
        openSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />

      <SignupDialog
        open={signupOpen}
        setOpen={setSignupOpen}
        openLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}