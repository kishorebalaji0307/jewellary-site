import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-amber-100/40 px-6 md:px-12 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="C:\Users\Danush Kumar N K\Downloads\KAVITHA LOGO-2_page-0001.jpg"
            alt="Kavitha Silver Jewellery Logo"
            className="w-10 h-10 rounded-full object-cover shadow-md group-hover:scale-105 transition-all duration-300 border border-amber-100/10"
          />
          <h1 className="text-2xl font-extrabold text-stone-900 font-serif tracking-tight group-hover:text-amber-800 transition-colors">
            Kavitha Jewellary<span className="text-amber-600 font-sans">.</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-6 font-semibold text-stone-600 text-sm">
        <Link
          to="/"
          className="hover:text-amber-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-stone-50"
        >
          Home
        </Link>

        {user && user.email === "admin@kavithasilver.com" && (
          <Link
            to="/add-product"
            className="text-amber-700 hover:text-amber-800 transition-colors py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100/70 border border-amber-200/40 flex items-center gap-1 font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-4 border-l border-stone-200 pl-4">
            <div className="flex items-center gap-2">
              {/* User Avatar Circle */}
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold uppercase text-xs">
                {user.name.charAt(0)}
              </div>
              <span className="text-stone-800 hidden sm:inline text-xs font-medium">
                Hello, <strong className="font-semibold text-stone-900">{user.name}</strong>
              </span>
            </div>

            <button
              onClick={logout}
              className="bg-stone-900 hover:bg-stone-800 text-white py-2 px-4 rounded-xl shadow-md transition-all text-xs font-bold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 border-l border-stone-200 pl-4">
            <Link
              to="/login"
              className="text-stone-700 hover:text-amber-700 py-2 px-3 rounded-xl transition-all text-xs font-bold"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2.5 px-4.5 rounded-xl shadow-md hover:shadow-amber-500/10 transition-all text-xs font-bold"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;