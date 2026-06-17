import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  // Guard clause: Only admin@kavithasilver.com has access
  if (!user || user.email !== "admin@kavithasilver.com") {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-rose-100 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto border border-rose-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold font-serif text-stone-900">Access Denied</h1>
            <p className="text-stone-600 text-sm">
              You do not have administrative privileges to access this page. Please sign in with the Admin email.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all text-xs">
                Go to Sign In
              </Link>
              <Link to="/" className="text-stone-600 hover:text-stone-800 font-semibold py-2 text-xs">
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
    <div className="min-h-screen bg-gradient-to-tr from-stone-50 via-stone-100 to-stone-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-amber-100/50">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-5 mb-6">
            <span className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900 font-serif">Add New Product</h1>
              <p className="text-stone-500 text-xs mt-0.5">Publish a new jewelry item to the storefront collection (Multiple images allowed)</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-pulse">
              <svg className="w-5 h-5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2 animate-shake">
              <svg className="w-5 h-5 flex-shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-stone-700">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sterling Silver Diamond Cut Ring"
                  disabled={isSubmitting}
                  className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-stone-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white text-sm cursor-pointer"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-stone-700">Price (INR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 4999"
                  disabled={isSubmitting}
                  className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-stone-700">Product Weight (Optional)</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 4.8g or 10.5 grams"
                  disabled={isSubmitting}
                  className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-semibold text-stone-700">Product Images *</label>
              
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden"
                  id="image-file-upload"
                />
                
                <label
                  htmlFor="image-file-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-2xl p-6 cursor-pointer bg-stone-50/50 hover:bg-amber-50/10 transition-all ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <svg className="w-8 h-8 text-stone-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-xs font-semibold text-stone-700">Select Multiple Images from Device</span>
                  <span className="text-[10px] text-stone-400 mt-1">PNG, JPG, JPEG are accepted. Files are previewed below.</span>
                </label>

                {/* Previews */}
                {images.length > 0 && (
                  <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/60">
                    <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Selected Images Previews ({images.length})</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {images.map((imgSrc, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200/80 bg-white group shadow-sm">
                          <img src={imgSrc} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white rounded-full p-1.5 hover:bg-rose-700 transition-all cursor-pointer shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <span className="absolute bottom-1 left-1.5 bg-stone-900/60 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded font-mono">
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
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-3">
              <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Quick Multi-Image Presets (For Testing)</span>
              <div className="flex flex-wrap gap-2">
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
                  className="text-[11px] bg-white border border-stone-200 text-stone-700 py-1.5 px-3 rounded-lg hover:border-amber-600 hover:text-amber-800 transition-all font-medium cursor-pointer"
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
                  className="text-[11px] bg-white border border-stone-200 text-stone-700 py-1.5 px-3 rounded-lg hover:border-amber-600 hover:text-amber-800 transition-all font-medium cursor-pointer"
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
                  className="text-[11px] bg-white border border-stone-200 text-stone-700 py-1.5 px-3 rounded-lg hover:border-amber-600 hover:text-amber-800 transition-all font-medium cursor-pointer"
                >
                  👑 Gold Bangles Preset (2 images)
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-semibold text-stone-700">Product Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the craftsmanship, materials, weight, and details of this piece..."
                disabled={isSubmitting}
                rows="4"
                className="w-full bg-stone-50/50 border border-stone-200 p-3 rounded-xl outline-none transition-all focus:border-amber-500 focus:bg-white text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-6 rounded-xl transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-amber-500/10 transition-all text-sm cursor-pointer disabled:opacity-50"
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
