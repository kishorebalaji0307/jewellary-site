const customerEmailStyles = `
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #f7f5f2;
    color: #333333;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }
  .container {
    max-width: 600px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5dfd9;
  }
  .header {
    background-color: #1a1a1a;
    color: #ffffff;
    text-align: center;
    padding: 30px 20px;
  }
  .header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 2px;
    color: #d4af37; /* Metallic Gold */
  }
  .content {
    padding: 40px 30px;
    line-height: 1.6;
  }
  .greeting {
    font-size: 18px;
    margin-bottom: 20px;
    color: #1a1a1a;
  }
  .product-card {
    background-color: #faf8f5;
    border: 1px solid #eee7de;
    border-radius: 8px;
    padding: 20px;
    margin: 25px 0;
    display: flex;
    align-items: center;
  }
  .product-info {
    margin-left: 20px;
    flex-grow: 1;
  }
  .product-name {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 5px 0;
  }
  .product-category {
    font-size: 12px;
    color: #8c8275;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  .product-price {
    font-size: 18px;
    font-weight: 700;
    color: #b8860b;
    margin: 0;
  }
  .footer {
    background-color: #faf8f5;
    text-align: center;
    padding: 20px;
    font-size: 12px;
    color: #8c8275;
    border-top: 1px solid #eee7de;
  }
  .footer p {
    margin: 5px 0;
  }
  .highlight-text {
    font-weight: bold;
    color: #1a1a1a;
  }
`;

const adminEmailStyles = `
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #f4f6f8;
    color: #333333;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    border: 1px solid #dbe2e6;
  }
  .header {
    background-color: #a30000; /* Notification Red/Burgundy */
    color: #ffffff;
    text-align: center;
    padding: 25px 20px;
  }
  .header h1 {
    margin: 0;
    font-size: 20px;
    letter-spacing: 1px;
  }
  .content {
    padding: 30px 25px;
  }
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    border-bottom: 2px solid #f4f6f8;
    padding-bottom: 8px;
    margin-top: 25px;
    margin-bottom: 15px;
  }
  .details-table {
    width: 100%;
    border-collapse: collapse;
  }
  .details-table td {
    padding: 8px 0;
    vertical-align: top;
  }
  .label {
    font-weight: bold;
    color: #707a8a;
    width: 30%;
  }
  .value {
    color: #1a1a1a;
  }
  .product-summary {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 15px;
    display: flex;
    align-items: center;
  }
  .product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
  }
  .product-details {
    margin-left: 15px;
  }
  .product-title {
    margin: 0 0 4px 0;
    font-size: 15px;
    font-weight: 600;
  }
  .product-meta {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 4px 0;
  }
  .product-price {
    font-size: 16px;
    font-weight: bold;
    color: #a30000;
    margin: 0;
  }
  .footer {
    background-color: #f1f5f9;
    text-align: center;
    padding: 15px;
    font-size: 12px;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
  }
`;

module.exports = {
  customerEmailStyles,
  adminEmailStyles,
};
