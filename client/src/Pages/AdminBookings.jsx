import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import "./AdminBookings.css";

function AdminBookings() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    if (user && user.email === "admin@kavithasilver.com") {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBookings(data);
      } else {
        setError(data.message || "Failed to load booking requests.");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookings((prevBookings) =>
          prevBookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        showToast("Booking status updated successfully.", "success");
      } else {
        showToast(data.message || "Failed to update booking status.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error occurred while updating booking status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Perform filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const name = (b.customerName || "").toLowerCase();
      const phone = (b.customerPhone || "").toLowerCase();
      const search = searchQuery.toLowerCase().trim();

      const matchesSearch = !search || name.includes(search) || phone.includes(search);
      const matchesStatus = !statusFilter || b.status === statusFilter;
      const matchesCategory = !categoryFilter || b.serviceCategory === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [bookings, searchQuery, statusFilter, categoryFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) {
    return (
      <div className="admin-bookings-page">
        <Navbar />
        <div className="spinner-wrapper" style={{ minHeight: "calc(100vh - 73px)" }}>
          <div className="spinner-icon animate-spin"></div>
        </div>
      </div>
    );
  }

  // Access check
  if (!user || user.email !== "admin@kavithasilver.com") {
    return (
      <div className="admin-bookings-page">
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
    <div className="admin-bookings-page">
      <Navbar />

      <main className="admin-bookings-container">
        <div className="bookings-dashboard-card">
          <div className="bookings-dashboard-header">
            <div>
              <div className="header-title-section">
                <span className="bookings-icon-box">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <h1 className="bookings-title">Home Service Bookings</h1>
              </div>
              <p className="bookings-subtitle">Track, filter, and manage customer booking requests for home visits</p>
            </div>

            {!loading && !error && (
              <span className="stats-pill">
                <strong>{filteredBookings.length}</strong>
                {filteredBookings.length === 1 ? "Booking Match" : "Bookings Matched"}
                {bookings.length > 0 && ` (of ${bookings.length} total)`}
              </span>
            )}
          </div>

          {error && (
            <div className="alert alert-error">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
              <button onClick={fetchBookings} style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>
                Retry
              </button>
            </div>
          )}

          {!error && (
            <div className="controls-panel">
              <div className="search-input-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by customer name or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  disabled={loading}
                />
              </div>

              <div className="filters-row">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-select"
                  disabled={loading}
                >
                  <option value="">All Services</option>
                  <option value="Ear Piercing">Ear Piercing</option>
                  <option value="Gold Services">Gold Services</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                  disabled={loading}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Completed">Completed</option>
                </select>

                {(searchQuery || statusFilter || categoryFilter) && (
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

          {loading ? (
            <div className="spinner-wrapper-local">
              <div className="spinner-icon animate-spin"></div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="table-responsive">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Customer Info</th>
                    <th>Address / Location</th>
                    <th>Service Category</th>
                    <th>Preferred Date</th>
                    <th>Additional Notes</th>
                    <th>Booking Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id}>
                      {/* Customer Info */}
                      <td>
                        <div className="customer-info-cell">
                          <span className="customer-name">{b.customerName}</span>
                          <span className="customer-phone">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="inline-icon">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {b.customerPhone}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="location-cell">
                        <span className="location-text" title={b.location}>{b.location}</span>
                      </td>

                      {/* Service Category */}
                      <td>
                        <span className="service-badge">
                          {b.serviceCategory}
                        </span>
                      </td>

                      {/* Preferred Date */}
                      <td>
                        <span className="preferred-date">
                          {formatDate(b.preferredDate)}
                        </span>
                      </td>

                      {/* Additional Notes */}
                      <td className="notes-cell">
                        <span className="notes-text" title={b.notes || "None"}>
                          {b.notes || <em style={{ color: "var(--stone-400)" }}>None</em>}
                        </span>
                      </td>

                      {/* Booking Request Date & Time */}
                      <td>
                        <div className="date-time-cell">
                          <span className="booking-date">{formatDate(b.createdAt)}</span>
                          <span className="booking-time">{formatTime(b.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <div className="status-selector-wrapper">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                            disabled={updatingId === b._id}
                            className={`status-select status-${b.status.toLowerCase()}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Completed">Completed</option>
                          </select>
                          {updatingId === b._id && <div className="spinner-mini status-spinner animate-spin"></div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bookings-empty-state">
              <div className="empty-icon-box">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="empty-title">No Booking Requests Found</h3>
              <p className="empty-description">
                {searchQuery || statusFilter || categoryFilter
                  ? "Try resetting your search filters to view all customer booking requests."
                  : "Home visit booking requests submitted by customers will be listed here."}
              </p>
              {(searchQuery || statusFilter || categoryFilter) && (
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

export default AdminBookings;
