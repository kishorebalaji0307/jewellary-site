import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Home() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
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
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans relative">
      {/* Background Image Layer */}
      {/* <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/silver_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      /> */}
      
      <Navbar />
 
      {/* Hero Section */}
      <header className="relative py-16 md:py-24 overflow-hidden border-b border-amber-100/40">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left copy column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/40 border border-amber-200/40 text-amber-800 text-xs font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              Est. 2005• Trusted Craftsmanship
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 font-serif leading-tight">
              Kavitha <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800">
                Silver Jewellery
              </span>
            </h1>

            <p className="text-stone-600 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Kavitha Silver Jewellery is your trusted partner for premium silver
              jewellery, custom gold orders, and expert jewellery repair services.
              We are committed to quality craftsmanship, trusted service, and
              complete customer satisfaction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-amber-500/10 hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                Join Exclusive Club
              </Link>
              <a
                href="#services"
                className="w-full sm:w-auto text-center border border-stone-300 hover:border-amber-600 text-stone-700 hover:text-amber-800 font-semibold py-4 px-8 rounded-xl hover:bg-amber-50/20 active:scale-95 transition-all text-sm"
              >
                View Services
              </a>
            </div>

            {/* Micro stats banner */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/60 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold font-serif text-stone-900">20+</p>
                <p className="text-xs text-stone-500 font-medium">Years Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-stone-900">10k+</p>
                <p className="text-xs text-stone-500 font-medium">Happy Clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-stone-900">100%</p>
                <p className="text-xs text-stone-500 font-medium">Certified Quality</p>
              </div>
            </div>
          </div>

          {/* Right image column */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500 to-stone-400 rounded-3xl blur opacity-30 animate-pulse" />
            <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-stone-100">
              <img
                src="/jewellery_hero.png"
                alt="Fine Jewellery Selection"
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Services Showcase */}
      <section id="services" className="py-20 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
              Our Specialties
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-stone-900">
              Unrivaled Design and Care
            </h2>
            <p className="text-stone-500 text-sm">
              Discover the full suite of bespoke services we provide at our exclusive salon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-2xl border border-amber-100/30 shadow-md transition-all duration-300 hover:shadow-xl hover:border-amber-500/20 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-bold mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <svg
                  className="w-6 h-6"
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
              <h3 className="text-xl font-bold text-stone-900 font-serif mb-3">
                Premium Silver
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Explore our luxurious collection of solid sterling silver jewellery, including
                hand-carved necklaces, custom statement rings, and delicate bangles.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-2xl border border-amber-100/30 shadow-md transition-all duration-300 hover:shadow-xl hover:border-amber-500/20 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-bold mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <svg
                  className="w-6 h-6"
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
              <h3 className="text-xl font-bold text-stone-900 font-serif mb-3">
                Custom Gold Orders
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Work directly with our master designers to craft custom solid gold pieces. From 
                initial sketch to final polish, we realize your dream creations.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-2xl border border-amber-100/30 shadow-md transition-all duration-300 hover:shadow-xl hover:border-amber-500/20 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-bold mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <svg
                  className="w-6 h-6"
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
              <h3 className="text-xl font-bold text-stone-900 font-serif mb-3">
                Expert Repair Services
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Restore structural integrity, replace lost settings, and resize precious heirlooms 
                with our delicate, high-precision repair and restoration services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection Section */}
      <section id="collection" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              Signature Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-stone-900">
              Explore Our Exquisite Catalog
            </h2>
            <p className="text-stone-500 text-sm">
              Indulge in our beautifully crafted premium silver and gold masterpieces.
            </p>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/60 max-w-lg mx-auto shadow-sm animate-fade-in">
              <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-bold text-stone-800 font-serif">No Products Yet</h3>
              <p className="text-stone-500 text-xs mt-1 px-4">Our artisans are busy crafting new premium designs. Please check back soon or contact us for custom orders.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl overflow-hidden border border-stone-200/65 shadow-sm hover:shadow-xl hover:border-amber-500/20 transition-all duration-300 flex flex-col group relative">
                  
                  <Link to={`/product/${product._id}`} className="relative overflow-hidden aspect-square bg-stone-100 block">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : "/jewellery_hero.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-amber-500/20">
                      {product.category}
                    </span>

                    {/* Quick Admin Actions directly on card */}
                    {user && user.email === "admin@kavithasilver.com" && (
                      <div className="absolute top-3 left-3 flex gap-2 z-10" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="w-7 h-7 rounded-lg bg-stone-900/85 backdrop-blur-md border border-stone-700/40 flex items-center justify-center text-white hover:bg-amber-600 hover:text-white transition-all shadow"
                          title="Edit Product"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          className="w-7 h-7 rounded-lg bg-rose-650/95 backdrop-blur-md border border-rose-800 flex items-center justify-center text-white hover:bg-rose-700 transition-all cursor-pointer shadow"
                          title="Delete Product"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <Link to={`/product/${product._id}`} className="space-y-2 block hover:opacity-85 transition-opacity">
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 font-serif">
                        {product.name}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <span className="text-base font-bold text-amber-800 font-serif">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <Link to={`/product/${product._id}`} className="text-[11px] font-bold text-stone-800 bg-stone-50 hover:bg-amber-600 hover:text-white px-3.5 py-1.5 rounded-lg border border-stone-200 hover:border-amber-600 transition-all cursor-pointer">
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

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center space-y-8">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            Our Core Values
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-stone-900">
            Commitment to Perfection
          </h2>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            At Kavitha Silver Jewellery, every step of our process reflects our devotion to quality. 
            From sourcing conflict-free precious metals to providing individual client attention, 
            we strive to create an experience as refined as the products we craft.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="p-4 border-r border-stone-200 last:border-0">
              <h4 className="text-amber-800 font-serif font-bold text-lg mb-1">Quality Craftsmanship</h4>
              <p className="text-xs text-stone-500">Meticulous details and hand-finished brilliance in every design.</p>
            </div>
            <div className="p-4 border-r border-stone-200 last:border-0">
              <h4 className="text-amber-800 font-serif font-bold text-lg mb-1">Trusted Service</h4>
              <p className="text-xs text-stone-500">Decades of gold-standard reliability, certificates, and valuations.</p>
            </div>
            <div className="p-4">
              <h4 className="text-amber-800 font-serif font-bold text-lg mb-1">Complete Satisfaction</h4>
              <p className="text-xs text-stone-500">Dedicated care, resizing services, and lifetime warranty assurance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-10 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src="C:\Users\Danush Kumar N K\Downloads\KAVITHA LOGO-2_page-0001.jpg"
              alt="Kavitha Silver Jewellery Logo"
              className="w-8 h-8 rounded-full object-cover border border-stone-700"
            />
            <span className="text-stone-200 font-serif font-semibold text-sm">
              Kavitha Silver Jewellery
            </span>
          </div>
          <p>© {new Date().getFullYear()} Kavitha Silver Jewellery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;