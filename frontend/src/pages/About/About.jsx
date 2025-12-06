import React from "react";
import { Link } from "react-router-dom";
import "./About.scss";
import { useSelector } from "react-redux";

export default function About() {
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <div className="about-page container py-5">
      <header className="about-hero mb-4">
        <h1>About Us</h1>
        <p className="lead text-muted">
          A comprehensive digital space designed to empower women with the tools,
          support, and community they need to grow, thrive, and lead with confidence.
        </p>
      </header>

      <div className="row gy-4">
        <div className="col-lg-8">
          <section className="about-section card p-4 mb-3">
            <h3 className="mb-3">Our Purpose</h3>
            <p>
              We believe every woman deserves access to reliable resources, expert
              guidance, and a safe environment where her voice is heard and valued.
              Our platform brings together a supportive community and a wide range
              of features to help women navigate both personal and professional
              journeys.
            </p>

            <h4 className="mt-4">What we offer</h4>
            <ul className="about-list">
              <li>Access to qualified professionals and experts</li>
              <li>Curated articles and practical guides</li>
              <li>Private and group community spaces</li>
              <li>Real-time chat to connect with peers and experts</li>
              <li>Privacy-forward settings and controls</li>
            </ul>
          </section>

          <section className="about-section card p-4 mb-3">
            <h3 className="mb-3">Our Promise</h3>
            <p>
              With secure access and a user-friendly interface, our mission is to
              ensure that every woman feels empowered to learn, share, and take the
              next step in her growth. Together, we’re building a space where
              inspiration is found, confidence is strengthened, and progress is celebrated.
            </p>
          </section>

          {!isLoggedIn && <section className="about-cta card p-4 text-center">
            <h4>Join our community</h4>
            <p className="mb-3">Move forward on your journey with support, connection, and purpose.</p>
            <Link to="/signup" className="btn btn-primary btn-lg">Register Now</Link>
          </section>}
        </div>

        <aside className="col-lg-4">
          <div className="card p-3 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/experts">Experts</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}