"use client";

import React from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Authentication = ({ children }) => {
  const provider = new GoogleAuthProvider();

  // Force account picker every time
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const onSignInClick = async () => {
    try {
      // Sign out existing user first to clear old session
      await signOut(auth);

      // Open popup with account chooser
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in as:", result.user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return <div onClick={onSignInClick}>{children}</div>;
};

export default Authentication;
