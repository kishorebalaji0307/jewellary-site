import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <Navbar />

      <main className="about-container animate-fade-in">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span style={{ color: "var(--stone-800)", fontWeight: "700" }}>About Us</span>
        </div>

        <div className="about-card">
          <div className="about-header">
            <span className="about-badge">Established 2005</span>
            <h1 className="about-title">About Kavitha Silver Jewellers</h1>
            <p className="about-subtitle">Honesty, Quality, and Decades of Traditional Craftsmanship</p>
          </div>

          <div className="about-content-grid">
            <div className="about-text-section">
              <p className="about-paragraph highlight-lead">
                Since <strong>2005</strong>, <strong>Kavitha Silver Jewellers</strong> has been a trusted name in <strong>Ganapathy, Coimbatore</strong>, proudly serving generations of families with honesty, quality, and traditional values. What began as a humble vision has grown into a destination where customers choose jewellery with confidence and celebrate life's most precious moments.
              </p>

              <p className="about-paragraph">
                We offer an elegant collection of <strong>ready-made silver jewellery</strong>, carefully selected to suit every occasion and tradition. We also undertake <strong>custom-made gold jewellery orders</strong>, crafted with precision using <strong>BIS Hallmarked Gold</strong>, ensuring purity, authenticity, and lasting value.
              </p>

              <p className="about-paragraph">
                Beyond jewellery sales, we are dedicated to preserving traditions through our specialized services, including <strong>gold and silver jewellery repair</strong>, <strong>ear piercing</strong>, and the crafting and customization of <strong>traditional Hindu Thali (Mangalsutra)</strong> designs. Every piece entrusted to us is treated with the same care and respect as if it were our own.
              </p>

              <div className="quote-box">
                <span className="quote-icon">“</span>
                <p className="quote-text">
                  At Kavitha Silver Jewellers, we believe that jewellery is more than beauty—it is a reflection of love, heritage, blessings, and lifelong memories. Every ornament carries a story, and we are honored to be a part of the celebrations, milestones, and traditions that bring families together.
                </p>
              </div>
            </div>

            <div className="about-image-section">
              <div className="about-image-frame">
                <div className="about-image-corner about-image-corner-tl" />
                <div className="about-image-corner about-image-corner-tr" />
                <div className="about-image-corner about-image-corner-bl" />
                <div className="about-image-corner about-image-corner-br" />
                <img
                  src="/silver_showroom_bg.png"
                  alt="Kavitha Silver Jewellers Showroom"
                  className="about-side-img"
                />
                <div className="about-image-glow" />
              </div>
            </div>
          </div>

          <div className="ornamental-divider">
            <div className="ornamental-line" />
            <div className="ornamental-center">◆</div>
            <div className="ornamental-line" />
          </div>

          {/* Founder Section */}
          <div className="founder-section">
            <div className="founder-visual">
              <div className="founder-badge-wrapper">
                <div className="founder-monogram">KN</div>
              </div>
            </div>

            <div className="founder-details">
              <span className="founder-label">Our Founder & Proprietor</span>
              <h2 className="founder-name">Mr. B. Nareshkumar</h2>
              <p className="founder-quote">
                "Proprietor of Kavitha Silver Jewellers, founded the business with a simple vision—to provide genuine jewellery, honest service, and lasting relationships built on trust. His dedication, integrity, and passion for traditional craftsmanship continue to inspire everything we do, making every customer feel like a part of our extended family."
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
