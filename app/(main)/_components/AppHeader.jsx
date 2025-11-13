"use client";

import { useAuthContext } from "../../provider";
import { SidebarTrigger } from "../../../components/ui/sidebar";
import Image from "next/image";
import React from "react";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

const AppHeader = () => {
  const { user, setUser } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      setUser(null); 
      router.push("/"); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="p-3 flex justify-between items-center">
      <SidebarTrigger />
      <div className="flex gap-4 items-center">
        {user?.pictureURL && (
          <Image
            src={user.pictureURL}
            alt="userImage"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        {user?.photoURL && (
          <Image
            src={user.photoURL}
            alt="user"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
        )}
        <Button onClick={handleLogout} className="hover:cursor-pointer">
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
