import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./AddProduct.css";

function AddProduct() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Rings");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If AuthContext is loading user info
  if (loading) {
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
      // Basic check for image size/type
      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !price || !images.length || !description.trim() || !category) {
      setError("Please fill in all required fields and upload at least one image.");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
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
        setSuccess("Product created successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setError(data.message || "Failed to create product");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("Network error, please try again.");
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <h1 className="dashboard-title">Add New Product</h1>
              <p className="dashboard-subtitle">Publish a new jewelry item to the storefront collection (Multiple images allowed)</p>
            </div>
          </div>

          {success && (
            <div className="alert alert-success animate-pulse">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error animate-shake">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

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
                  id="image-file-upload"
                />
                
                <label
                  htmlFor="image-file-upload"
                  className={`uploader-dashed-label ${isSubmitting ? "disabled" : ""}`}
                >
                  <svg className="uploader-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="uploader-title">Select Multiple Images from Device</span>
                  <span className="uploader-subtitle">PNG, JPG, JPEG are accepted. Files are previewed below.</span>
                </label>
 
                {images.length > 0 && (
                  <div className="previews-container">
                    <span className="previews-title">Selected Images Previews ({images.length})</span>
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

            {/* Quick Sample Presets */}
            <div className="presets-container">
              <span className="presets-title">Quick Multi-Image Presets (For Testing)</span>
              <div className="presets-list">
                <button
                  type="button"
                  onClick={() => {
                    setName("Classic Solitaire Diamond Ring");
                    setCategory("Rings");
                    setPrice("8500");
                    setWeight("3.8g");
                    setImages([
                      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop"
                    ]);
                  }}
                  className="presets-btn"
                >
                  💍 Diamond Ring Preset (3 images)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName("Elegant Sterling Silver Pendant");
                    setCategory("Necklaces");
                    setPrice("12500");
                    setWeight("9.2g");
                    setImages([
                      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop"
                    ]);
                  }}
                  className="presets-btn"
                >
                  📿 Silver Necklace Preset (2 images)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName("Royal Gold Bangle Set");
                    setCategory("Bangles");
                    setPrice("24000");
                    setWeight("28g");
                    setImages([
                      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
                    ]);
                  }}
                  className="presets-btn"
                >
                  👑 Gold Bangles Preset (2 images)
                </button>
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
                onClick={() => navigate("/")}
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
                {isSubmitting ? "Adding Piece..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
