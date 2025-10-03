import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { useSelector } from "react-redux";


export default function DefaultLayout() {
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <div className="layout">
      <Header />
      <div className="body">
        
        {isLoggedIn && <Sidebar /> }
        <main className="content">
          {/* Page content goes here */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
