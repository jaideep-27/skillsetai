// Netlify Function: Verify Razorpay Signature (server-side)
// Requires env var: RAZORPAY_KEY_SECRET
const crypto = require('crypto');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body || '{}');
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const valid = expected === razorpay_signature;
    return { statusCode: 200, body: JSON.stringify({ valid }) };
  } catch (err) {
    console.error('Verify payment error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Verification failed' }) };
  }
}
