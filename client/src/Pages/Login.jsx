import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, googleLogin, user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Google Login Initialization
  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "304246253516-4gepg2ltqdhjsmg4qlh9d19va8ft7vka.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { theme: "outline", size: "large", width: "384", shape: "rectangular" }
        );
      } else {
        setTimeout(initGoogle, 200); // Poll until script loaded
      }
    };
    initGoogle();
  }, []);

  const handleGoogleResponse = async (response) => {
    setIsSubmitting(true);
    
    try {
      const result = await googleLogin(response.credential);
      if (result.success) {
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        showToast(result.message || "Google sign-in failed", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      showToast("Google Login failed. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        showToast(result.message || "Invalid credentials", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      showToast("An unexpected error occurred. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <div className="auth-header">
          <img
            src="/logo.jpg"
            alt="Kavitha Silver Jewellery Logo"
            className="auth-logo"
          />
          <h1 className="auth-title">
            Kavitha Jewellery
          </h1>
          <p className="auth-subtitle">
            Access your custom luxury dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isSubmitting}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-submit"
          >
            {isSubmitting ? (
              <span className="btn-submit-spinner">
                <svg
                  className="animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        {/* Google sign-in container */}
        <div className="google-container">
          <div id="google-signin-btn" className="google-btn-wrapper"></div>
        </div>

        <p className="auth-redirect">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="auth-redirect-link"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;