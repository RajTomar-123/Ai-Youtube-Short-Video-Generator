"use client"
import React, { useContext, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from './_context/AuthContext'
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { api } from '../convex/_generated/api'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Provider = ({ children }) => {

  const [user, setUser] = useState();
  const createUser = useMutation(api.users.CreateNewUser);
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  useEffect(() => {
  const unSubscribe = onAuthStateChanged(auth, async (user) => {
    console.log("Auth User:", user);
    if (user) {  
      const result = await createUser({
        name: user.displayName || "",
        email: user.email || "",
        pictureURL: user.photoURL || ""
      });
      console.log("Convex Result:", result);
      setUser(result);
    } else {
      setUser(null);
    }
  });

  return () => unSubscribe();
}, []);



  return (
    <div>
      <ConvexProvider client={convex}>
        <AuthContext.Provider value={{ user, setUser }}>
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange>
              {children}
            </NextThemesProvider>
          </PayPalScriptProvider>
        </AuthContext.Provider>
      </ConvexProvider>
    </div>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
}

export default Provider
