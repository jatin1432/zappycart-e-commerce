const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderConfirmation = async (to, order) => {
  const orderHTML = `
    <h2>Thank you for your order!</h2>
    <p>Order ID: ${order._id}</p>
    <p>Total: ₹${order.totalAmount}</p>
    <p>Status: ${order.isPaid ? "Paid" : "Unpaid"}</p>
    <p>Items:</p>
    <ul>
      ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join("")}
    </ul>
  `;

  await resend.emails.send({
    from: "ZappyCart <orders@zappycart.in>",
    to,
    subject: "Your ZappyCart Order Confirmation",
    html: orderHTML,
  });
};

module.exports = sendOrderConfirmation;
