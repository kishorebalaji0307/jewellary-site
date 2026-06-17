import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is already logged in, redirect to Home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Input validations
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(name, email, password);

      if (result.success) {
        setSuccess("Registration successful! Creating your session...");
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-amber-50 via-stone-100 to-amber-100/50 p-4">
      <div className="bg-white/80 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-xl border border-amber-100/50 transition-all duration-300 hover:shadow-2xl hover:border-amber-200/50">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            Create Membership
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-3 font-serif">
            Jewellery Shop
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Join us for an exclusive, custom luxury experience
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-pulse">
            <svg
              className="w-5 h-5 flex-shrink-0 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2 animate-shake">
            <svg
              className="w-5 h-5 flex-shrink-0 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-stone-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              disabled={isSubmitting}
              className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-stone-900 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-stone-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isSubmitting}
              className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-stone-900 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-stone-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-stone-900 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-stone-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 text-stone-900 disabled:opacity-50"
            />
          </div>



          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-amber-500/10 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-stone-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-4 decoration-amber-700/30 transition-all"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;