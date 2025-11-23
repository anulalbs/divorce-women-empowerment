import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// hero image: local copy (downloaded to src/assets/hero.jpg)
import heroLocal from "../assets/hero.jpg";
import "./Home.scss";

export default function Home() {
  const { isLoggedIn } = useSelector((s) => s.user || {});

  return (
    <>
    <div
      className="home-hero"
      style={{ backgroundImage: `url(${heroLocal})` }}
      role="img"
      aria-label="Women and girls empowerment"
    >
      <div className="home-hero__overlay" />
      <div className="home-hero__content container">
        <h1 className="home-hero__title">EmpowerHer — Support, Learn and Grow</h1>
        <p className="home-hero__subtitle">
          A safe community and resource hub offering practical guides, vetted experts,
          and peer support to help you navigate separation and divorce with confidence.
        </p>

        <div className="home-hero__cta">
          {!isLoggedIn ? (
            <>
              <Link className="btn btn-lg btn-primary" to="/signup">Get Started</Link>
              <Link className="btn btn-lg btn-outline-light" to="/signin">Sign In</Link>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-primary" to="/community">Go to Community</Link>
              <Link className="btn btn-lg btn-outline-light" to="/messages">Messages</Link>
            </>
          )}
        </div>
      </div>
    </div>
      {/* Below-hero content populated from provided PDF/text */}
      <section className="home-content container py-5">
        <div className="row">
          <div className="col-md-8">
            <h2>Welcome to Divorced Women Empowerment</h2>
            <p>
              This platform is a comprehensive online space created to empower women by
              providing easy access to resources, expert guidance, community interaction,
              and knowledge sharing. Users can register to engage in discussions, seek
              advice from professionals, explore insightful blogs, and connect with other
              women through real-time chat. With secure access and a user-friendly
              interface, the platform supports women in their personal and professional
              growth, helping them build confidence, find inspiration, and move forward on
              their journey.
            </p>
            <h4>Core Services</h4>
            <ul className="home-features">
              <li><strong>Expert</strong> — Get help and advice from experts anytime.</li>
              <li><strong>Free Registration</strong> — Get access to the right platform at zero cost.</li>
              <li><strong>Live chat</strong> — Talk instantly with experts and users via live chat.</li>
              <li><strong>Advanced Privacy Settings</strong> — Services respecting your personality and privacy.</li>
            </ul>
            <div className="mt-3">
              <Link to="/signup" className="btn btn-lg btn-primary">Register Now</Link>
            </div>
          </div>

          <aside className="col-md-4">
            <div className="card p-3 mb-3">
              <h5>Quick links</h5>
              <ul className="quick-links list-unstyled mb-0">
                <li><Link to="/about">About us</Link></li>
                <li><Link to="/signin">Login</Link></li>
                <li><Link to="/signup">Register</Link></li>
                <li><Link to="/blogs">Blogs</Link></li>
                <li><Link to="/community">Communities</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
