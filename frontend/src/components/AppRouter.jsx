import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Resources from "../pages/Resources";
import Blog from "../pages/Blog";
import DefaultLayout from "../layouts/default.layout";
import Signup from "../pages/Signup/Signup";
import Signin from "../pages/Signin/Signin";
import Users from "../pages/Users";
import BlogList from "../pages/Blogs/BlogList";
import BlogDetail from "../pages/Blogs/BlogDetails";
import CreateBlog from "../pages/Blogs/BlogCreate";
import CommunityPage from "../pages/Community/Community";
import Experts from "../pages/Experts/List";
import ExpertDetails from "../pages/Experts/ExpertDetails";
import CreateExpert from "../pages/Experts/Create";
import ExpertsUsersView from "../pages/Experts/UsersView";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import Messages from "../pages/Messages";
import { useSelector } from "react-redux";

export default function AppRouter(){
  const { isLoggedIn } = useSelector((state) => state.user);
    return (
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
            <Route path="/" element={!isLoggedIn ? <Home />: <div>Dashboard</div>} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            {/* admin-only pages */}
            <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            {/* allow admins and experts to create blogs */}
            <Route path="/blogs/create" element={<ProtectedRoute allowedRoles={["admin","expert"]}><CreateBlog /></ProtectedRoute>} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/experts/find" element={<ExpertsUsersView />} />
            <Route path="/experts/:id" element={<ExpertDetails />} />
            {/* only admins may create experts */}
            <Route path="/experts/create" element={<ProtectedRoute allowedRoles={["admin"]}><CreateExpert /></ProtectedRoute>} />
            {/* messages require login (any role) */}
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} /> */}

            </Route>
          </Routes>
        </BrowserRouter>
      );
}