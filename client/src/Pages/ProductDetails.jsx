import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Order Request Modal State
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Prefill details if user is logged in
  useEffect(() => {
    if (user && showOrderModal) {
      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
    }
  }, [user, showOrderModal]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setModalError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setModalError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(customerPhone)) {
      setModalError("Please enter a valid phone number (minimum 10 digits).");
      return;
    }

    setModalSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          productId: product._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalSuccess("Order Request placed successfully!");
        setCustomerPhone("");
        setTimeout(() => {
          setShowOrderModal(false);
          setModalSuccess("");
        }, 1500);
      } else {
        setModalError(data.message || "Failed to submit order request.");
      }
    } catch (err) {
      console.error(err);
      setModalError("Network error. Please try again.");
    } finally {
      setModalSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setProduct(data);
        } else {
          setError(data.message || "Failed to load product details");
        }
      } catch (err) {
        console.error(err);
        setError("Network error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        navigate("/");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete product");
        setIsDeleting(false);
        setDeleteConfirm(false);
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred during delete.");
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const isAdmin = user && user.email === "admin@kavithasilver.com";

  if (loading) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="spinner-wrapper" style={{ minHeight: "calc(100vh - 73px)" }}>
          <div className="spinner-icon animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="notfound-wrapper">
          <div className="notfound-card">
            <svg className="notfound-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="notfound-title">Product Not Found</h2>
            <p className="notfound-desc">{error || "The product you are looking for does not exist or has been removed."}</p>
            <Link to="/" className="btn-notfound-home">
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["/jewellery_hero.png"];

  return (
    <div className="details-page">
      <Navbar />

      <main className="details-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: "var(--stone-800)", fontWeight: "700" }}>{product.name}</span>
        </div>

        <div className="details-card">
          
          {/* Gallery Column (left) */}
          <div className="details-gallery">
            <div className="gallery-main-wrapper">
              <img
                src={images[activeImageIdx]}
                alt={product.name}
                className="gallery-main-image"
              />
              <span className="gallery-badge">
                {product.category}
              </span>
            </div>

            {/* Slider/Carousel Thumbnails */}
            {images.length > 1 && (
              <div className="gallery-thumbnails">
                {images.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`thumbnail-btn ${activeImageIdx === idx ? "active" : ""}`}
                  >
                    <img src={imgSrc} alt={`Thumbnail ${idx + 1}`} className="thumbnail-image" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column (right) */}
          <div className="details-info">
            <div className="details-header">
              <h1 className="details-title">
                {product.name}
              </h1>
              
              <div className="details-price-row">
                <span className="details-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                
                {product.weight && (
                  <span className="details-weight">
                    Weight: {product.weight}
                  </span>
                )}
              </div>
            </div>

            <div className="details-desc-box">
              <h3 className="details-desc-title">Description</h3>
              <p className="details-desc-content">
                {product.description}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Regular client action */}
              <button
                onClick={() => setShowOrderModal(true)}
                className="btn-inquire"
              >
                Place Order
              </button>

              {/* Admin Actions Container */}
              {isAdmin && (
                <div className="admin-panel">
                  <span className="admin-panel-title">Admin Control Panel</span>
                  
                  {deleteConfirm ? (
                    <div className="delete-confirm-card">
                      <span className="delete-confirm-warn">Are you sure you want to delete this product? This cannot be undone.</span>
                      <div className="delete-confirm-actions">
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="btn-delete-confirm"
                        >
                          {isDeleting ? "Deleting..." : "Yes, Delete Product"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="btn-delete-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-actions-row">
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="btn-admin-edit"
                      >
                        Edit Product
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="btn-admin-delete"
                      >
                        Delete Product
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Order Request Modal */}
      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Place Order</h2>
              <button className="modal-close-btn" onClick={() => setShowOrderModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modalSuccess && (
              <div className="alert alert-success animate-pulse" style={{ marginBottom: "1rem" }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{modalSuccess}</span>
              </div>
            )}

            {modalError && (
              <div className="alert alert-error animate-shake" style={{ marginBottom: "1rem" }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="form-input"
                  disabled={modalSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="form-input"
                  disabled={modalSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="form-input"
                  disabled={modalSubmitting}
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="btn-cancel"
                  style={{ padding: "0.5rem 1rem" }}
                  disabled={modalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-add-product"
                  style={{ padding: "0.5rem 1.5rem" }}
                  disabled={modalSubmitting}
                >
                  {modalSubmitting ? "Submitting..." : "Submit Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
