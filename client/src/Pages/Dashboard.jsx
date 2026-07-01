import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";
import "./Dashboard.css";

function Dashboard() {
  const { user, setUser, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("history"); // history | settings
  const [historySubTab, setHistorySubTab] = useState("orders"); // orders | bookings

  // History state
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Profile Settings state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, navigate]);

  // Fetch History on mount
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchOrders();
    fetchBookings();
    window.scrollTo(0, 0);
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast("Please enter your current password to save changes.", "error");
      return;
    }

    if (password && password !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    setUpdatingProfile(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password: password || undefined,
          currentPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Profile updated successfully!", "success");
        // Update user context and token
        localStorage.setItem("token", data.token);
        setUser(data.user);
        // Clear passwords
        setPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
      } else {
        showToast(data.message || "Failed to update profile.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating profile.", "error");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header block */}
          <div className="dashboard-header">
            <div className="dashboard-welcome">
              <div className="dashboard-welcome-avatar">
                {user.name.charAt(0)}
              </div>
              <div>
                <span className="dashboard-welcome-badge">Account Portal</span>
                <h1 className="dashboard-welcome-title">Welcome back, {user.name}</h1>
                <p className="dashboard-welcome-email">{user.email}</p>
              </div>
            </div>
            
            <button className="dashboard-signout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>

          <div className="dashboard-content-wrapper">
            {/* Tabs Sidebar */}
            <aside className="dashboard-sidebar">
              <button
                className={`sidebar-tab-btn ${activeTab === "history" ? "active" : ""}`}
                onClick={() => setActiveTab("history")}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                My History
              </button>
              <button
                className={`sidebar-tab-btn ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings
              </button>
            </aside>

            {/* Main Details Panel */}
            <div className="dashboard-details-panel">
              {activeTab === "history" && (
                <div className="history-tab-content">
                  {/* Segmented control for history sub-tabs */}
                  <div className="history-segmented-control">
                    <button
                      className={`segmented-btn ${historySubTab === "orders" ? "active" : ""}`}
                      onClick={() => setHistorySubTab("orders")}
                    >
                      My Orders ({orders.length})
                    </button>
                    <button
                      className={`segmented-btn ${historySubTab === "bookings" ? "active" : ""}`}
                      onClick={() => setHistorySubTab("bookings")}
                    >
                      Home Service Bookings ({bookings.length})
                    </button>
                  </div>

                  {historySubTab === "orders" ? (
                    <div className="history-list-wrapper">
                      {loadingOrders ? (
                        <div className="history-loading"><div className="history-spinner animate-spin"></div></div>
                      ) : orders.length === 0 ? (
                        <div className="history-empty">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <h3>No Orders Placed Yet</h3>
                          <p>When you register purchase inquiries on our catalog, they will appear here.</p>
                          <Link to="/products" className="history-empty-btn">Browse Collection</Link>
                        </div>
                      ) : (
                        <div className="history-items-grid">
                          {orders.map((order) => (
                            <div key={order._id} className="history-card order-item-card">
                              <div className="history-card-header">
                                <div>
                                  <span className="history-card-meta-label">ORDER PLACED</span>
                                  <span className="history-card-meta-value">{formatDate(order.createdAt)}</span>
                                </div>
                                <div>
                                  <span className="history-card-meta-label">INQUIRY ID</span>
                                  <span className="history-card-meta-value font-mono">{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                </div>
                              </div>
                              
                              <div className="history-card-body">
                                <div className="history-item-details">
                                  <img
                                    src={order.productDetails?.image || "/jewellery_hero.png"}
                                    alt={order.productDetails?.name}
                                    className="history-item-img"
                                  />
                                  <div className="history-item-info">
                                    <span className="history-item-category">{order.productDetails?.category}</span>
                                    <h4 className="history-item-name">{order.productDetails?.name}</h4>
                                    <p className="history-item-contact">Contact Phone: <strong>{order.customerPhone}</strong></p>
                                    <p className="history-item-contact">Name: <strong>{order.customerName}</strong></p>
                                  </div>
                                </div>
                                <div className="history-item-pricing">
                                  <span className="history-item-price-label">Estimated Price</span>
                                  <span className="history-item-price-val">₹{order.productDetails?.price?.toLocaleString("en-IN")}</span>
                                  <div className="history-status-badge success">
                                    Inquiry Received
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="history-list-wrapper">
                      {loadingBookings ? (
                        <div className="history-loading"><div className="history-spinner animate-spin"></div></div>
                      ) : bookings.length === 0 ? (
                        <div className="history-empty">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <h3>No Bookings Scheduled</h3>
                          <p>Need custom gold order consultations or ear piercing? Book a home service slot.</p>
                          <Link to="/booking" className="history-empty-btn">Book Home Visit</Link>
                        </div>
                      ) : (
                        <div className="history-items-grid">
                          {bookings.map((booking) => (
                            <div key={booking._id} className="history-card booking-item-card">
                              <div className="history-card-header">
                                <div>
                                  <span className="history-card-meta-label">REQUEST SUBMITTED</span>
                                  <span className="history-card-meta-value">{formatDate(booking.createdAt)}</span>
                                </div>
                                <div>
                                  <span className="history-card-meta-label">PREFERRED VISIT DATE</span>
                                  <span className="history-card-meta-value">
                                    {booking.preferredDate ? formatDate(booking.preferredDate) : "TBD (Our team will call you)"}
                                  </span>
                                </div>
                              </div>

                              <div className="history-card-body">
                                <div className="history-item-details">
                                  <div className="history-booking-icon">
                                    {booking.serviceCategory === "Ear Piercing" ? "👂" : "✨"}
                                  </div>
                                  <div className="history-item-info">
                                    <span className="history-item-category">Home Visit Service</span>
                                    <h4 className="history-item-name">{booking.serviceCategory}</h4>
                                    <p className="history-item-location">Address: <strong>{booking.location}</strong></p>
                                    {booking.notes && <p className="history-item-notes">Notes: <em>"{booking.notes}"</em></p>}
                                  </div>
                                </div>
                                <div className="history-item-pricing">
                                  <span className="history-item-price-label">Booking Status</span>
                                  <div className={`history-status-badge ${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                  </div>
                                  <p className="history-item-contact" style={{ marginTop: "1rem" }}>Phone: <strong>{booking.customerPhone}</strong></p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="settings-tab-content">
                  <h2 className="settings-panel-title">Account Information</h2>
                  <p className="settings-panel-subtitle">Update your personal profile, email address, and account credentials.</p>

                  <form className="settings-form" onSubmit={handleProfileUpdate}>
                    <div className="settings-form-row">
                      <div className="settings-form-group">
                        <label className="settings-label">Full Name</label>
                        <input
                          type="text"
                          className="settings-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="settings-form-group">
                        <label className="settings-label">Email Address</label>
                        <input
                          type="email"
                          className="settings-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="settings-divider" />

                    <h3 className="settings-section-heading">Change Password</h3>
                    <p className="settings-panel-subtitle">Leave these fields blank if you do not wish to change your password.</p>

                    <div className="settings-form-row">
                      <div className="settings-form-group">
                        <label className="settings-label">New Password</label>
                        <input
                          type="password"
                          className="settings-input"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="settings-form-group">
                        <label className="settings-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="settings-input"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="settings-divider" />

                    <h3 className="settings-section-heading secure-heading">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "1.25rem", height: "1.25rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Password Verification Required
                    </h3>
                    <p className="settings-panel-subtitle">To commit these changes, please verify your identity by entering your current account password.</p>

                    <div className="settings-form-group current-password-group">
                      <label className="settings-label">Current Password</label>
                      <input
                        type="password"
                        className="settings-input secure-input"
                        placeholder="Required to save changes"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="settings-submit-btn" disabled={updatingProfile}>
                      {updatingProfile ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
