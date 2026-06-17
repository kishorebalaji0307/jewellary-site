import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-stone-200 text-center space-y-4">
            <svg className="w-12 h-12 text-rose-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold font-serif text-stone-900">Product Not Found</h2>
            <p className="text-stone-500 text-xs">{error || "The product you are looking for does not exist or has been removed."}</p>
            <Link to="/" className="inline-block bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md">
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["/jewellery_hero.png"];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-8">
          <Link to="/" className="hover:text-amber-800">Home</Link>
          <span>/</span>
          <span className="text-stone-400">{product.category}</span>
          <span>/</span>
          <span className="text-stone-800 font-bold line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-stone-200/50">
          
          {/* Gallery Column (left) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-stone-100 bg-stone-50 shadow-inner group">
              <img
                src={images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <span className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md text-amber-400 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-amber-500/20">
                {product.category}
              </span>
            </div>

            {/* Slider/Carousel Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2 pr-2 scrollbar-thin scrollbar-thumb-stone-200">
                {images.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImageIdx === idx
                        ? "border-amber-600 ring-2 ring-amber-500/10 scale-95"
                        : "border-stone-200 hover:border-amber-500/40"
                    }`}
                  >
                    <img src={imgSrc} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column (right) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-bold text-amber-800 font-serif">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                
                {product.weight && (
                  <span className="bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-bold px-3 py-1 rounded-lg">
                    Weight: {product.weight}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-b border-stone-100 py-6 space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-stone-400 font-extrabold">Description</h3>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              {/* Regular client action */}
              <button
                onClick={() => alert(`Inquiry submitted for ${product.name}. Our design consultant will email you shortly.`)}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-8 rounded-xl shadow-md hover:shadow-amber-500/15 transition-all text-sm cursor-pointer"
              >
                Inquire & Customize Details
              </button>

              {/* Admin Actions Container */}
              {isAdmin && (
                <div className="border-t border-stone-100 pt-6 mt-6 space-y-4">
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest">Admin Control Panel</span>
                  
                  {deleteConfirm ? (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-3">
                      <span className="block text-xs font-bold text-rose-800">Are you sure you want to delete this product? This cannot be undone.</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Yes, Delete Product"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="flex-1 text-center bg-stone-900 hover:bg-stone-850 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-md"
                      >
                        Edit Product
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="flex-1 bg-white border border-rose-200 hover:bg-rose-50/50 text-rose-600 font-bold py-3 px-6 rounded-xl text-xs transition-all"
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
    </div>
  );
}

export default ProductDetails;
