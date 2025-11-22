import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home";
import About from "../pages/About";
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
import CreateExpert from "../pages/Experts/Create";
import Messages from "../pages/Messages";

export default function AppRouter(){
    return (
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/experts/create" element={<CreateExpert />} />
            <Route path="/messages" element={<Messages />} />
            {/* <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} /> */}

            </Route>
          </Routes>
        </BrowserRouter>
      );
}