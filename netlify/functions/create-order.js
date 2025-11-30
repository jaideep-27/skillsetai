// Netlify Function: Create Razorpay Order (server-side)
// Requires env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
const Razorpay = require('razorpay');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency = 'INR', courseId } = JSON.parse(event.body || '{}');
    if (!amount || amount <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await rzp.orders.create({ amount, currency, receipt: `course_${courseId || 'na'}` });
    return { statusCode: 200, body: JSON.stringify(order) };
  } catch (err) {
    console.error('Create order error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create order' }) };
  }
}
