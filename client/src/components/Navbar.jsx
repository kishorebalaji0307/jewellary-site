import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand-link">
          <img
            src="C:/Users/Danush Kumar N K/Downloads/KAVITHA LOGO-2_page-0001.jpg"
            alt="Kavitha Silver Jewellery Logo"
            className="navbar-logo"
          />
          <h1 className="navbar-title">
            Kavitha Jewellary<span>.</span>
          </h1>
        </Link>
      </div>

      <div className="navbar-menu">
        <Link to="/" className="navbar-link">
          Home
        </Link>

        {user && user.email === "admin@kavithasilver.com" && (
          <>
            <Link to="/add-product" className="navbar-link-admin">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
            <Link to="/admin/orders" className="navbar-link-admin">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              View Orders
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

            <button onClick={logout} className="navbar-btn-signout">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="navbar-user-section">
            <Link to="/login" className="navbar-link-signin">
              Sign In
            </Link>
            <Link to="/register" className="navbar-btn-register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;