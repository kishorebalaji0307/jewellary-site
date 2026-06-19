import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src="/logo.png"
            alt="Kavitha Silver Jewellery Logo"
            className="footer-logo"
          />
          <span className="footer-brand-name">
            Kavitha Silver Jewellery
          </span>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Kavitha Silver Jewellery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
