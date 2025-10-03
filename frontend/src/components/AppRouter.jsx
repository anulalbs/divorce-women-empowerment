import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home";
import About from "../pages/About";
import Resources from "../pages/Resources";
import Community from "../pages/Community";
import Blog from "../pages/Blog";
import DefaultLayout from "../layouts/default.layout";
import Signup from "../pages/Signup/Signup";
import Signin from "../pages/Signin/Signin";

export default function AppRouter(){
    return (
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      );
}