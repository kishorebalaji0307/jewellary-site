import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";
import "./Booking.css";

function Booking() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [location, setLocation] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Prefill details if user is logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields check
    if (!customerName.trim() || !customerPhone.trim() || !location.trim() || !serviceCategory) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(customerPhone)) {
      showToast("Please enter a valid phone number (minimum 10 digits).", "error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail: user ? user.email : undefined,
          customerPhone,
          location,
          serviceCategory,
          preferredDate: preferredDate || undefined,
          notes,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Home visit booking request submitted successfully! We will contact you soon.", "success");
        // Reset form fields
        setCustomerPhone("");
        setLocation("");
        setServiceCategory("");
        setPreferredDate("");
        setNotes("");
      } else {
        showToast(data.message || "Failed to submit booking request.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please check if the server is running and try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <Navbar />

      <main className="booking-container animate-fade-in">
        <div className="booking-card">
          <div className="booking-header">
            <span className="booking-badge">Home Service</span>
            <h1 className="booking-title">Book a Home Visit</h1>
            <p className="booking-desc">
              Experience our premium services in the comfort of your home. 
              Our expert team will visit your location based on your selected service category.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="form-input"
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="form-input"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Category *</label>
              <select
                required
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="form-input form-select"
                disabled={submitting}
              >
                <option value="">Select Service Category</option>
                <option value="Ear Piercing">Ear Piercing</option>
                <option value="Gold Services">Gold Services</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Address / Location *</label>
              <textarea
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter complete door number, street, city, and pincode..."
                className="form-input form-textarea"
                rows="3"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Date (Optional)</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="form-input"
                disabled={submitting}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requests or instructions for our visiting team..."
                className="form-input form-textarea"
                rows="3"
                disabled={submitting}
              />
            </div>

            <div className="booking-info-note">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="note-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                <strong>Important Notice:</strong> Our dedicated professionals will visit your specified location based on your request. We will contact you to coordinate and confirm the visit details.
              </p>
            </div>

            <button type="submit" className="btn-submit-booking" disabled={submitting}>
              {submitting ? "Submitting Request..." : "Book Home Visit"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Booking;
