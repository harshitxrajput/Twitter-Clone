import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"
import LoadingSpinner from "./components/common/LoadingSpinner";

const App = () => {

  const { data:authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })

        const data = await res.json();
        if(data.error) return null;
        if (!res.ok){
          throw new Error(data.error || "Something went wrong")
        }

        console.log("User is here", data);
        return data;
      }
      catch (err) {
        throw new Error(err.message);
      }
    },
    retry: false
  });

  if(isLoading){
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }

  return (
    <div className='flex max-w-6xl mx-auto'>

      { authUser && <Sidebar /> }

      <Routes>
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to={"/"} /> } />

        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to={"/"} /> } />

        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to={"/login"} /> } />

        <Route path="/profile/:username" element={ authUser ? <ProfilePage /> : <Navigate to={"/login"} /> } />
        
        <Route path="/notifications" element={ authUser ? <NotificationPage /> : <Navigate to={"/login"} /> } />
      </Routes>

      { authUser && <RightPanel /> }

      <Toaster />
    </div>
  );
};

export default App;
