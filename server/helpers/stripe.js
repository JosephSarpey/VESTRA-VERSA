const stripe = require('stripe')('your_stripe_secret_key');

const createPaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createPaymentIntent,
};