import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";
import "./Catalog.css";

function Catalog() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showToast("Product deleted successfully", "success");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete product", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting product", "error");
    }
  };

  return (
    <div className="catalog-page">
      <Navbar />

      <main className="catalog-main">
        <div className="catalog-header-section">
          <div className="catalog-header-glow" />
          <div className="catalog-header-container">
            <span className="catalog-badge-top">Exquisite Collection</span>
            <h1 className="catalog-page-title">Our Full Collection</h1>
            <div className="catalog-ornament-line" />
            <p className="catalog-page-desc">
              Explore our complete range of premium handcrafted silver creations, custom gold orders, and artisan masterpieces.
            </p>
          </div>
        </div>

        <section className="catalog-grid-section">
          <div className="catalog-page-container">
            {productsLoading ? (
              <div className="catalog-loading-wrapper">
                <div className="catalog-spinner animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="catalog-empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3>No Products Found</h3>
                <p>Our catalog is currently empty. Check back soon for beautiful additions!</p>
              </div>
            ) : (
              <div className="catalog-page-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card premium-card">
                    <div className="product-image-container">
                      <Link to={`/product/${product._id}`} className="product-image-link">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : "/jewellery_hero.png"}
                          alt={product.name}
                          className="product-image"
                        />
                        <span className="product-badge">{product.category}</span>
                      </Link>

                      {user && user.email === "admin@kavithasilver.com" && (
                        <div className="product-admin-actions">
                          <Link
                            to={`/edit-product/${product._id}`}
                            className="product-admin-btn-edit"
                            title="Edit Product"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this product?")) {
                                deleteProduct(product._id);
                              }
                            }}
                            className="product-admin-btn-delete"
                            title="Delete Product"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="product-card-body">
                      <Link to={`/product/${product._id}`} className="product-card-info">
                        <h3 className="product-card-title">{product.name}</h3>
                        <p className="product-card-desc">{product.description}</p>
                      </Link>
                      <div className="product-card-footer">
                        <span className="product-card-price">₹{product.price.toLocaleString("en-IN")}</span>
                        <Link to={`/product/${product._id}`} className="product-card-btn-view">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Catalog;
