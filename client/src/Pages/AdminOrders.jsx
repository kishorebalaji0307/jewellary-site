import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./AdminOrders.css";

function AdminOrders() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Available categories list
  const categories = ["Rings", "Necklaces", "Bangles", "Earrings", "Bracelets", "Custom Jewelry"];

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data);
      } else {
        setError(data.message || "Failed to load order requests.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Network error. Please check if backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch orders if user is authenticated and is the admin
    if (user && user.email === "admin@kavithasilver.com") {
      fetchOrders();
    }
  }, [user]);

  // Perform search & category filtering in memory for instant reactivity and scalability
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query Filter
      const search = searchQuery.toLowerCase().trim();
      const customerName = (order.customerName || "").toLowerCase();
      const customerEmail = (order.customerEmail || "").toLowerCase();
      const customerPhone = (order.customerPhone || "").toLowerCase();
      const productName = (order.productDetails?.name || "").toLowerCase();

      const matchesSearch =
        !search ||
        customerName.includes(search) ||
        customerEmail.includes(search) ||
        customerPhone.includes(search) ||
        productName.includes(search);

      // 2. Category Filter
      const orderCategory = order.productCategory || order.productDetails?.category || "";
      const matchesCategory =
        !selectedCategory ||
        orderCategory.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [orders, searchQuery, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If AuthContext is loading user credentials
  if (authLoading) {
    return (
      <div className="admin-orders-page">
        <Navbar />
        <div className="spinner-wrapper" style={{ minHeight: "calc(100vh - 73px)" }}>
          <div className="spinner-icon animate-spin"></div>
        </div>
      </div>
    );
  }

  // Route Guard: Access restriction for regular users
  if (!user || user.email !== "admin@kavithasilver.com") {
    return (
      <div className="admin-orders-page">
        <Navbar />
        <div className="denied-wrapper">
          <div className="denied-card">
            <div className="denied-icon-box">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="denied-title">Access Denied</h1>
            <p className="denied-desc">
              You do not have administrative privileges to access this page. Please sign in with the Admin email.
            </p>
            <div className="denied-actions">
              <Link to="/login" className="denied-btn-signin">
                Go to Sign In
              </Link>
              <Link to="/" className="denied-btn-home">
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <Navbar />

      <main className="admin-orders-container">
        <div className="orders-dashboard-card">
          {/* Dashboard Header */}
          <div className="orders-dashboard-header">
            <div>
              <div className="header-title-section">
                <span className="orders-icon-box">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </span>
                <h1 className="orders-title">Customer Order Requests</h1>
              </div>
              <p className="orders-subtitle">Track, search, and filter incoming product order requests from customers</p>
            </div>

            {!loading && !error && (
              <span className="stats-pill">
                <strong>{filteredOrders.length}</strong>
                {filteredOrders.length === 1 ? "Order Match" : "Orders Matched"}
                {orders.length > 0 && ` (of ${orders.length} total)`}
              </span>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-error animate-shake">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
              <button onClick={fetchOrders} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>
                Retry
              </button>
            </div>
          )}

          {/* Controls Bar: Search & Category Dropdown */}
          {!error && (
            <div className="controls-panel">
              <div className="search-input-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by customer, email, phone or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  disabled={loading}
                />
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                  disabled={loading}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {(searchQuery || selectedCategory) && (
                  <button onClick={handleClearFilters} className="btn-clear-filters">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <div className="spinner-wrapper-local">
              <div className="spinner-icon animate-spin"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            /* Tabular Results */
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const snap = order.productDetails || {};
                    const productExist = !!order.product;
                    return (
                      <tr key={order._id}>
                        {/* Customer Name */}
                        <td>
                          <span className="customer-name">{order.customerName}</span>
                        </td>

                        {/* Email Address */}
                        <td>
                          <div className="customer-meta">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{order.customerEmail}</span>
                          </div>
                        </td>

                        {/* Phone Number */}
                        <td>
                          <div className="customer-meta">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{order.customerPhone}</span>
                          </div>
                        </td>

                        {/* Product Name */}
                        <td>
                          <div className="product-info-cell">
                            <img
                              src={snap.image || "/jewellery_hero.png"}
                              alt={snap.name || "Product"}
                              className="product-thumbnail"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/jewellery_hero.png";
                              }}
                            />
                            <div className="product-details-text">
                              {productExist ? (
                                <Link to={`/product/${order.product}`} className="product-name-link">
                                  {snap.name || "Unnamed Product"}
                                </Link>
                              ) : (
                                <span style={{ fontWeight: 600, color: "var(--stone-800)" }}>
                                  {snap.name || "Deleted Product"}
                                </span>
                              )}
                              <span className="product-price">₹{(snap.price || 0).toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </td>

                        {/* Product Category */}
                        <td>
                          <span className="product-category-badge">
                            {order.productCategory || snap.category || "N/A"}
                          </span>
                        </td>

                        {/* Order Date */}
                        <td>
                          <div className="order-date-cell">
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                            <span className="order-time">{formatTime(order.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="orders-empty-state">
              <div className="empty-icon-box">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="empty-title">No Order Requests Found</h3>
              <p className="empty-description">
                {searchQuery || selectedCategory
                  ? "Try resetting your search filters to view all customer order requests."
                  : "Orders placed by customers will be visible here."}
              </p>
              {(searchQuery || selectedCategory) && (
                <button onClick={handleClearFilters} className="btn-empty-reset">
                  Reset Search & Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminOrders;
