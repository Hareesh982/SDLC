const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email', // Example: 'smtp.gmail.com'
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});

// @desc    Send order confirmation email
exports.sendOrderConfirmationEmail = async (toEmail, orderId, totalPrice) => {
  const mailOptions = {
    from: `"E-commerce App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Order Confirmation #${orderId}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>
      <p>Total amount: <strong>$${totalPrice.toFixed(2)}</strong></p>
      <p>We will send another email once your order has shipped.</p>
      <p>Regards,<br>The E-commerce Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${toEmail} for order ${orderId}`);
  } catch (error) {
    console.error(`Failed to send order confirmation email to ${toEmail}:`, error);
  }
};

// You can add more email utility functions here (e.g., password reset, welcome email)
