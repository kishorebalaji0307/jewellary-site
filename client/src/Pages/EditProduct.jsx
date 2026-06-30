import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config";
import "./EditProduct.css";

function EditProduct() {
  const { user, loading } = useContext(AuthContext);
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Rings");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  
  const [fetching, setFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check auth and fetch product on mount
  useEffect(() => {
    if (loading) return;

    // Guard: Only admin can access
    if (!user || user.email !== "admin@kavithasilver.com") {
      setFetching(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setName(data.name);
          setCategory(data.category);
          setPrice(data.price);
          setWeight(data.weight || "");
          setImages(data.images || []);
          setDescription(data.description);
        } else {
          showToast(data.message || "Failed to load product details", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Error loading product details", "error");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, user, loading]);

  // If AuthContext is loading user info or fetching product
  if (loading || fetching) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="spinner-wrapper" style={{ minHeight: "calc(100vh - 73px)" }}>
          <div className="spinner-icon animate-spin"></div>
        </div>
      </div>
    );
  }

  // Guard clause: Only admin@kavithasilver.com has access
  if (!user || user.email !== "admin@kavithasilver.com") {
    return (
      <div className="dashboard-page">
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        showToast("Only image files are supported", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !images.length || !description.trim() || !category) {
      showToast("Please fill in all required fields and upload at least one image.", "error");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      showToast("Please enter a valid price greater than zero.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          price: numericPrice,
          images,
          description,
          weight: weight.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Product updated successfully!", "success");
        setTimeout(() => {
          navigate(`/product/${id}`);
        }, 1200);
      } else {
        showToast(data.message || "Failed to update product", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      showToast("Network error, please try again.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <span className="dashboard-icon-box">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            <div>
              <h1 className="dashboard-title">Edit Product</h1>
              <p className="dashboard-subtitle">Modify specifications or manage image catalog for this jewelry piece</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sterling Silver Diamond Cut Ring"
                  disabled={isSubmitting}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="form-select"
                >
                  <option value="Rings">Rings</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Bangles">Bangles</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Custom Jewelry">Custom Jewelry</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Price (INR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 4999"
                  disabled={isSubmitting}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Weight (Optional)</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 4.8g or 10.5 grams"
                  disabled={isSubmitting}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Images *</label>
              
              <div className="uploader-wrapper">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  style={{ display: "none" }}
                  id="edit-image-file-upload"
                />
                
                <label
                  htmlFor="edit-image-file-upload"
                  className={`uploader-dashed-label ${isSubmitting ? "disabled" : ""}`}
                >
                  <svg className="uploader-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="uploader-title">Add More Images from Device</span>
                  <span className="uploader-subtitle">Images can be deleted or updated in the preview layout below.</span>
                </label>

                {images.length > 0 && (
                  <div className="previews-container">
                    <span className="previews-title">Manage Images ({images.length})</span>
                    <div className="previews-grid">
                      {images.map((imgSrc, idx) => (
                        <div key={idx} className="preview-card">
                          <img src={imgSrc} alt={`Preview ${idx + 1}`} className="preview-image" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="preview-delete-btn"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <span className="preview-badge">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the craftsmanship, materials, weight, and details of this piece..."
                disabled={isSubmitting}
                rows="4"
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/product/${id}`)}
                disabled={isSubmitting}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-add-product"
              >
                {isSubmitting ? "Saving Changes..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
