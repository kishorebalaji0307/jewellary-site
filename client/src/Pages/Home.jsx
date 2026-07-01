import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";
import "./Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);

  const showcaseItems = [
    {
      url: "/custom_showcase_3.png",
      title: "Royal Kundan Antique Necklace",
      type: "Custom Gold Necklace"
    },
    {
      url: "/custom_showcase_1.png",
      title: "Handcrafted Diamond Cut Couple Rings",
      type: "Custom Gold Rings"
    },
    {
      url: "/custom_showcase_2.png",
      title: "Intricate Filigree Artisan Bracelets",
      type: "Custom Gold Bracelets"
    },
    {
      url: "/custom_showcase_4.png",
      title: "Exquisite Signature S-Link Chain",
      type: "Custom Gold Chain"
    },
    {
      url: "/custom_showcase_5.png",
      title: "Royal Ruby-Studded Gold Bangles",
      type: "Custom Gold Bangles"
    }
  ];

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
  }, []);

  const deleteProductFromHome = async (id) => {
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
    <div className="home-page">
      <Navbar />
 
      {/* Hero Section */}
      <header className="hero-section">
        {/* Background Image Layer */}
        <div className="hero-bg-image" />
        {/* Premium dark gradient overlay for text readability */}
        <div className="hero-overlay" />

        {/* Background glow effects */}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        {/* Floating luxury particles */}
        <div className="hero-particle hero-particle-1" />
        <div className="hero-particle hero-particle-2" />
        <div className="hero-particle hero-particle-3" />
        <div className="hero-particle hero-particle-4" />
        <div className="hero-particle hero-particle-5" />

        <div className="hero-container">
          {/* Left copy column */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot animate-pulse" />
              Est. 2005 • Trusted Craftsmanship
            </div>

            <h1 className="hero-title">
              Kavitha <br />
              <span className="hero-title-accent">
                Silver Jewellers
              </span>
            </h1>

            <p className="hero-description">
              Kavitha Silver Jewellers is your trusted partner for premium silver
              jewellery, custom gold orders, and expert jewellery repair services.
              We are committed to quality craftsmanship, trusted service, and
              complete customer satisfaction.
            </p>

            <div className="hero-actions">
              {!user && (
                <Link to="/register" className="hero-btn-primary">
                  Join Exclusive Club
                </Link>
              )}
              <a href="#services" className="hero-btn-secondary">
                View Services
              </a>
            </div>

            {/* Micro stats banner */}
            <div className="hero-stats">
              <div>
                <p className="hero-stat-number">20+</p>
                <p className="hero-stat-label">Years Active</p>
              </div>
              <div>
                <p className="hero-stat-number">10k+</p>
                <p className="hero-stat-label">Happy Clients</p>
              </div>
              <div>
                <p className="hero-stat-number">100%</p>
                <p className="hero-stat-label">Certified Quality</p>
              </div>
            </div>
          </div>

          {/* Right image column */}
          <div className="hero-right">
            <div className="hero-right-pulse-bg animate-pulse" />
            <div className="hero-image-wrapper">
              <img
                src="/jewellery_hero.png"
                alt="Fine Silver Jewellers Selection"
                className="hero-image"
              />
              {/* Premium reflection overlay */}
              <div className="hero-image-shine" />
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="hero-bottom-ornament" />
      </header>

      {/* Services Showcase */}
      <section id="services" className="services-section">
        {/* Section ornament */}
        <div className="section-glow services-glow" />

        <div className="services-container">
          <div className="services-header scroll-reveal">
            <span className="services-subtitle">
              Our Specialties
            </span>
            <h2 className="services-title">
              Unrivaled Design and Care
            </h2>
            <div className="section-ornament-line" />
            <p className="services-header-text">
              Discover the full suite of bespoke services we provide at our exclusive salon.
            </p>
          </div>

          <div className="services-grid">
            {/* Service 1 */}
            <div className="service-card gradient-border-card scroll-reveal">
              <div className="service-icon-wrapper">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="service-card-title">
                Premium Silver
              </h3>
              <p className="service-card-desc">
                Explore our luxurious collection of solid sterling silver jewellery, including
                hand-carved necklaces, custom statement rings, and delicate bangles.
              </p>
            </div>

            {/* Service 2 */}
            <div className="service-card gradient-border-card scroll-reveal">
              <div className="service-icon-wrapper">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              </div>
              <h3 className="service-card-title">
                Custom Gold Orders
              </h3>
              <p className="service-card-desc">
                Work directly with our master designers to craft custom solid gold pieces. From 
                initial sketch to final polish, we realize your dream creations.
              </p>
            </div>

            {/* Service 3 */}
            <div className="service-card gradient-border-card scroll-reveal">
              <div className="service-icon-wrapper">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="service-card-title">
                Expert Repair Services
              </h3>
              <p className="service-card-desc">
                Restore structural integrity, replace lost settings, and resize precious heirlooms 
                with our delicate, high-precision repair and restoration services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection Section */}
      <section id="collection" className="catalog-section">
        <div className="catalog-container">
          <div className="catalog-header scroll-reveal">
            <span className="catalog-badge">
              Signature Collection
            </span>
            <h2 className="catalog-title">
              Explore Our Exquisite Catalog
            </h2>
            <div className="section-ornament-line" />
            <p className="catalog-desc">
              Indulge in our beautifully crafted premium silver and gold masterpieces.
            </p>
          </div>

          {productsLoading ? (
            <div className="catalog-loading">
              <div className="catalog-loading-spinner animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="catalog-empty animate-fade-in">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="catalog-empty-title">No Products Yet</h3>
              <p className="catalog-empty-desc">Our artisans are busy crafting new premium designs. Please check back soon or contact us for custom orders.</p>
            </div>
          ) : (
            <>
              <div className="catalog-grid">
                {products.slice(0, 4).map((product) => (
                <div key={product._id} className="product-card gradient-border-card scroll-reveal">
                  
                  <div className="product-image-container">
                    <Link to={`/product/${product._id}`} className="product-image-link">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : "/jewellery_hero.png"}
                        alt={product.name}
                        className="product-image"
                      />
                      <span className="product-badge">
                        {product.category}
                      </span>
                    </Link>

                    {/* Quick Admin Actions directly on card */}
                    {user && user.email === "admin@kavithasilver.com" && (
                      <div className="product-admin-actions" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="product-admin-btn-edit"
                          title="Edit Product"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this product?")) {
                              deleteProductFromHome(product._id);
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
                      <h3 className="product-card-title">
                        {product.name}
                      </h3>
                      <p className="product-card-desc">
                        {product.description}
                      </p>
                    </Link>
                    <div className="product-card-footer">
                      <span className="product-card-price">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <Link to={`/product/${product._id}`} className="product-card-btn-view">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length > 4 && (
              <div className="catalog-actions scroll-reveal" style={{ textAlign: "center", marginTop: "40px" }}>
                <Link to="/products" className="catalog-view-all-btn">
                  View All Products
                </Link>
              </div>
            )}
            </>
          )}
        </div>
      </section>

      {/* Custom Showcase Section */}
      <section className="showcase-section">
        <div className="showcase-bg-glow" />
        <div className="showcase-bg-texture" />

        <div className="showcase-container">
          <div className="showcase-grid-layout">
            
            {/* Left Content Column */}
            <div className="showcase-content scroll-reveal-left">
              <div className="showcase-badge">Bespoke Creations</div>
              <h2 className="showcase-title">Where Tradition Meets Craftsmanship</h2>
              <p className="showcase-desc">
                Designed exclusively for our customer, this handcrafted jewelry piece embodies the beauty of traditional artistry and refined elegance. Carefully crafted by our skilled artisans, it stands as a testament to our dedication to quality, heritage, and personalized design.
              </p>
              
              {/* Image Selectors / Thumbnails */}
              <div className="showcase-selector-group">
                <span className="showcase-selector-label">Select Custom Masterpiece:</span>
                <div className="showcase-thumbnails">
                  {showcaseItems.map((item, idx) => (
                    <button
                      key={idx}
                      className={`showcase-thumb-btn ${activeShowcaseIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveShowcaseIndex(idx)}
                      title={item.title}
                    >
                      <img src={item.url} alt={item.title} />
                      <div className="showcase-thumb-overlay" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Active creation details */}
              <div className="showcase-details">
                <span className="showcase-details-type">{showcaseItems[activeShowcaseIndex].type}</span>
                <h4 className="showcase-details-title">{showcaseItems[activeShowcaseIndex].title}</h4>
              </div>
            </div>

            {/* Right Image Showcase Column */}
            <div className="showcase-viewer scroll-reveal-right">
              <div className="showcase-frame">
                {/* Decorative corner ornaments */}
                <div className="showcase-corner showcase-corner-tl" />
                <div className="showcase-corner showcase-corner-tr" />
                <div className="showcase-corner showcase-corner-bl" />
                <div className="showcase-corner showcase-corner-br" />
                
                {/* Premium glow behind image */}
                <div className="showcase-image-glow" />

                <div className="showcase-img-container">
                  <img
                    src={showcaseItems[activeShowcaseIndex].url}
                    alt={showcaseItems[activeShowcaseIndex].title}
                    key={activeShowcaseIndex}
                    className="showcase-active-img"
                  />
                  <div className="showcase-img-reflection" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="values-section">
        <div className="values-container">
          <span className="values-badge scroll-reveal">
            Our Core Values
          </span>
          <h2 className="values-title scroll-reveal">
            Commitment to Perfection
          </h2>
          <div className="section-ornament-line scroll-reveal" />
          <p className="values-desc scroll-reveal">
            At Kavitha Silver Jewellers, every step of our process reflects our devotion to quality. 
            From sourcing conflict-free precious metals to providing individual client attention,  
            we strive to create an experience as refined as the products we craft.
          </p>
          <div className="values-grid">
            <div className="value-item gradient-border-card scroll-reveal">
              <div className="value-icon">✦</div>
              <h4 className="value-item-title">Quality Craftsmanship</h4>
              <p className="value-item-desc">Meticulous details and hand-finished brilliance in every design.</p>
            </div>
            <div className="value-item gradient-border-card scroll-reveal">
              <div className="value-icon">✦</div>
              <h4 className="value-item-title">Trusted Service</h4>
              <p className="value-item-desc">Decades of gold-standard reliability, certificates, and valuations.</p>
            </div>
            <div className="value-item gradient-border-card scroll-reveal">
              <div className="value-icon">✦</div>
              <h4 className="value-item-title">Complete Satisfaction</h4>
              <p className="value-item-desc">Dedicated care, resizing services, and lifetime warranty assurance.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;