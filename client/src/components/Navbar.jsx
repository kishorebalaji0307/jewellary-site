import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand-link" onClick={() => setIsMenuOpen(false)}>
          <img
            src="/logo.jpg"
            alt="Kavitha Silver Jewellery Logo"
            className="navbar-logo"
          />
          <h1 className="navbar-title">
            Kavitha Jewellary<span>.</span>
          </h1>
        </Link>
      </div>

      {/* Hamburger Toggle */}
      <button
        className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
        <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link to="/booking" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
          Booking
        </Link>
        <Link to="/about" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
          About Us
        </Link>

        {user && user.email === "admin@kavithasilver.com" && (
          <>
            <Link to="/add-product" className="navbar-link-admin" onClick={() => setIsMenuOpen(false)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
            <Link to="/admin/orders" className="navbar-link-admin" onClick={() => setIsMenuOpen(false)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              View Orders
            </Link>
            <Link to="/admin/bookings" className="navbar-link-admin" onClick={() => setIsMenuOpen(false)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Bookings
            </Link>
          </>
        )}

        {user ? (
          <div className="navbar-user-section">
            <div className="navbar-user-profile">
              {/* User Avatar Circle */}
              <div className="navbar-avatar">
                {user.name.charAt(0)}
              </div>
              <span className="navbar-hello-user">
                Hello, <strong>{user.name}</strong>
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="navbar-btn-signout"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="navbar-user-section">
            <Link to="/login" className="navbar-link-signin" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/register" className="navbar-btn-register" onClick={() => setIsMenuOpen(false)}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;