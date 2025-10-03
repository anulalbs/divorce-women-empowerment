import { useState } from "react";
import logo from "../../assets/logo.png";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../store/userSlice";
import { NavLink } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.user);
    const handleLogin = () => {
        dispatch(
            login({ name: "John Doe", email: "john@example.com", avatar: "" })
        );
    };

    const handleLogout = () => {
        dispatch(logout());
        setUserMenuOpen(false);
    };
    return (
        <header className="header">
            <div className="brand"><img src={logo} alt="Logo" className="logo" />
                <span>EmpowerHer</span>
            </div>
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
                <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
                <NavLink to="/resources" onClick={() => setMenuOpen(false)}>Resources</NavLink>
                <NavLink to="/community" onClick={() => setMenuOpen(false)}>Community</NavLink>
                <NavLink to="/blog" onClick={() => setMenuOpen(false)}>Blog</NavLink>

                {!isLoggedIn ? (
                    <a href="#" onClick={handleLogin}>Login</a>
                ) : (
                    <div className="user-menu">
                        <div
                            className="user-icon"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <FaUser />
                        </div>
                        {userMenuOpen && (
                            <div className="dropdown">
                                <a href="#">Profile</a>
                                <a href="#" onClick={handleLogout}>Logout</a>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
