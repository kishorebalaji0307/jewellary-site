import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* Decorative top border */}
      <div className="footer-top-accent" />

      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <div className="footer-brand">
            <img
              src="/logo.jpg"
              alt="Kavitha Silver Jewellery Logo"
              className="footer-logo"
            />
            <span className="footer-brand-name">
              Kavitha Silver Jewellery
            </span>
          </div>
          <p className="footer-tagline">
            Crafting timeless elegance since 2005. Premium handcrafted silver & custom gold jewellery.
          </p>
        </div>

        {/* Divider */}
        <div className="footer-divider">
          <div className="footer-divider-line" />
          <span className="footer-divider-ornament">◆</span>
          <div className="footer-divider-line" />
        </div>

        {/* Bottom Row */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Kavitha Silver Jewellery. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="footer-social">
            {/* Instagram */}
            <a href="#" className="footer-social-link" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="footer-social-link" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="#" className="footer-social-link" aria-label="WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
