const dns = require("dns");

// Force Node.js to prefer IPv4 DNS resolution over IPv6 to prevent ENETUNREACH errors
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const nodemailer = require("nodemailer");
const { customerEmailStyles, adminEmailStyles } = require("./emailStyles");

// Create a transporter using Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer transporter verification failed ❌:", error.message);
  } else {
    console.log("Nodemailer transporter is ready to send emails ✉️");
  }
});

/**
 * Generate premium HTML template for Customer confirmation
 */
const getCustomerEmailTemplate = (order) => {
  const { customerName, productDetails } = order;
  const formattedPrice = Number(productDetails.price).toLocaleString("en-IN");
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Request Received</title>
      <style>
        ${customerEmailStyles}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KAVITHA SILVER JEWELLERS</h1>
        </div>
        <div class="content">
          <div class="greeting">Dear <span class="highlight-text">${customerName}</span>,</div>
          <p>Thank you for your interest in our collections. We have successfully received your order request. Our team will review the details and get in touch with you shortly to assist you with the purchase process.</p>
          
          <div class="product-card">
            <div class="product-info">
              <div class="product-category">${productDetails.category}</div>
              <h3 class="product-name">${productDetails.name}</h3>
              <p class="product-price">₹${formattedPrice}</p>
            </div>
          </div>
          
          <p>If you have any questions or would like to add special instructions to your order request, please feel free to reply directly to this email or reach out to us at our support line.</p>
          
          <p style="margin-top: 30px;">Warm regards,<br><span class="highlight-text">Kavitha Silver Jewellers Team</span></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Kavitha Silver Jewellers. All rights reserved.</p>
          <p>This is an automated confirmation of your request.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate premium HTML template for Admin notification
 */
const getAdminEmailTemplate = (order) => {
  const { customerName, customerEmail, customerPhone, productDetails } = order;
  const formattedPrice = Number(productDetails.price).toLocaleString("en-IN");
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Request</title>
      <style>
        ${adminEmailStyles}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Order Request Received</h1>
        </div>
        <div class="content">
          <p>A new purchase inquiry has been submitted by a customer on the Silver Jewellers store. Please see the details below:</p>
          
          <div class="section-title">Customer Contact Details</div>
          <table class="details-table">
            <tr>
              <td class="label">Name:</td>
              <td class="value">${customerName}</td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td class="value"><a href="mailto:${customerEmail}">${customerEmail}</a></td>
            </tr>
            <tr>
              <td class="label">Phone:</td>
              <td class="value"><a href="tel:${customerPhone}">${customerPhone}</a></td>
            </tr>
          </table>
          
          <div class="section-title">Product Requested</div>
          <div class="product-summary">
            ${
              productDetails.image && productDetails.image.startsWith("http")
                ? `<img src="${productDetails.image}" alt="${productDetails.name}" class="product-image" />`
                : ""
            }
            <div class="product-details">
              <h4 class="product-title">${productDetails.name}</h4>
              <p class="product-meta">Category: ${productDetails.category}</p>
              <p class="product-price">Price: ₹${formattedPrice}</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated system notification from your Silver Jewellers Website backend.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send order confirmation emails to the customer and notification email to the admin
 * @param {Object} order - The saved order object from database
 */
const sendOrderEmails = async (order) => {
  const adminEmail = process.env.EMAIL_USER; // Sent to admin email (self-notification)

  const mailToCustomerOptions = {
    from: `"Kavitha Silver Jewellers" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: "Order Request Received - Kavitha Silver Jewellers",
    html: getCustomerEmailTemplate(order),
  };

  const mailToAdminOptions = {
    from: `"Silver Jewellers Store Notification" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🚨 New Order Request from ${order.customerName}`,
    html: getAdminEmailTemplate(order),
  };

  try {
    console.log(`Attempting to send email notifications for order: ${order._id}`);
    const results = await Promise.all([
      transporter.sendMail(mailToCustomerOptions),
      transporter.sendMail(mailToAdminOptions),
    ]);
    console.log("Email notifications sent successfully: ✅");
    return results;
  } catch (error) {
    console.error("Failed to send order email notifications: ❌", error.message);
    throw error;
  }
};

/**
 * Generate premium HTML template for Booking notification to Admin
 */
const getBookingEmailTemplate = (booking) => {
  const { customerName, customerPhone, location, serviceCategory, preferredDate, notes } = booking;
  const formattedDate = preferredDate
    ? new Date(preferredDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not Specified";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Home Service Booking Request</title>
      <style>
        ${adminEmailStyles}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background-color: #451a03;">
          <h1 style="color: #fde68a; margin: 0; font-size: 20px; letter-spacing: 1px;">📅 New Home Service Booking Request</h1>
        </div>
        <div class="content">
          <p>A new home visit booking request has been submitted by a customer. Please review the details below:</p>
          
          <div class="section-title">Booking Details</div>
          <table class="details-table">
            <tr>
              <td class="label">Name:</td>
              <td class="value">${customerName}</td>
            </tr>
            <tr>
              <td class="label">Phone:</td>
              <td class="value"><a href="tel:${customerPhone}">${customerPhone}</a></td>
            </tr>
            <tr>
              <td class="label">Address / Location:</td>
              <td class="value">${location}</td>
            </tr>
            <tr>
              <td class="label">Category:</td>
              <td class="value" style="font-weight: bold; color: #b45309;">${serviceCategory}</td>
            </tr>
            <tr>
              <td class="label">Preferred Date:</td>
              <td class="value">${formattedDate}</td>
            </tr>
            <tr>
              <td class="label">Notes:</td>
              <td class="value">${notes || "No additional notes provided."}</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>This is an automated system notification from your Silver Jewellers Website backend.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send booking notification email to the admin
 * @param {Object} booking - The saved booking object from database
 */
const sendBookingEmail = async (booking) => {
  const adminEmail = process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Silver Jewellers Booking" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `📅 New Home Visit Booking (${booking.serviceCategory}) from ${booking.customerName}`,
    html: getBookingEmailTemplate(booking),
  };

  try {
    console.log(`Attempting to send booking email notification for booking: ${booking._id}`);
    const result = await transporter.sendMail(mailOptions);
    console.log("Booking email notification sent successfully: ✅");
    return result;
  } catch (error) {
    console.error("Failed to send booking email notification: ❌", error.message);
    throw error;
  }
};

module.exports = {
  transporter,
  sendOrderEmails,
  sendBookingEmail,
};
