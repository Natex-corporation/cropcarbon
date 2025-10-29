require('dotenv').config();
const express = require('express');
const path = require('path');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 3000;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })
  : null;

if (!stripeSecretKey) {
  console.warn('Stripe secret key is not configured. API routes will return errors until it is provided.');
}

app.use(express.json({ limit: '1mb' }));

const staticDir = path.join(__dirname);
app.use(express.static(staticDir));

function buildAppUrl() {
  const fallback = `http://localhost:${port}`;
  const base = process.env.APP_URL || fallback;
  try {
    return new URL(base);
  } catch (error) {
    console.warn('Invalid APP_URL provided. Falling back to default.', error);
    return new URL(fallback);
  }
}

app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe secret key is not configured on the server.' });
  }

  const { amount, frequency = 'once', message = '', name = 'Supporter' } = req.body || {};
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Please provide a valid donation amount greater than zero.' });
  }

  const unitAmount = Math.round(parsedAmount * 100);
  if (unitAmount < 50) {
    return res.status(400).json({ error: 'Stripe requires a minimum charge of $0.50.' });
  }

  const safeMessage = String(message || '').slice(0, 280);
  const safeName = String(name || '').slice(0, 80) || 'Supporter';
  const safeFrequency = ['once', 'monthly', 'annual'].includes(frequency) ? frequency : 'once';

  const appUrl = buildAppUrl();
  const successUrl = new URL(appUrl);
  successUrl.searchParams.set('donation', 'success');
  successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');

  const cancelUrl = new URL(appUrl);
  cancelUrl.searchParams.set('donation', 'cancelled');

  const metadata = {
    frequency: safeFrequency,
    message: safeMessage,
    donor_name: safeName,
  };

  try {
    const lineItem = {
      quantity: 1,
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'CropCarbon Donation',
          description: `Support regenerative projects (${safeFrequency})`,
        },
        unit_amount: unitAmount,
      },
    };

    const sessionConfig = {
      line_items: [lineItem],
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      customer_creation: 'if_required',
      allow_promotion_codes: true,
      metadata,
    };

    if (safeFrequency === 'monthly' || safeFrequency === 'annual') {
      sessionConfig.mode = 'subscription';
      lineItem.price_data.recurring = {
        interval: safeFrequency === 'monthly' ? 'month' : 'year',
      };
      sessionConfig.subscription_data = { metadata };
    } else {
      sessionConfig.mode = 'payment';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Failed to create Stripe checkout session', error);
    res.status(500).json({ error: error.message || 'Unable to create Stripe session.' });
  }
});

app.get('/api/session/:id', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe secret key is not configured on the server.' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing session id.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['line_items', 'customer', 'subscription', 'subscription.plan'],
    });

    const lineItem = session.line_items?.data?.[0];
    const amountCents =
      session.amount_total ??
      lineItem?.amount_total ??
      lineItem?.price?.unit_amount ??
      session.subscription?.plan?.amount ??
      0;
    const interval =
      lineItem?.price?.recurring?.interval || session.subscription?.plan?.interval || session.metadata?.interval;

    res.json({
      id: session.id,
      status: session.status,
      mode: session.mode,
      payment_status: session.payment_status,
      amount: amountCents ? amountCents / 100 : 0,
      currency: session.currency || lineItem?.currency || 'usd',
      frequency:
        session.metadata?.frequency ||
        session.subscription?.metadata?.frequency ||
        (interval === 'month' ? 'monthly' : interval === 'year' ? 'annual' : 'once'),
      message: session.metadata?.message || session.subscription?.metadata?.message || '',
      customer_name:
        session.customer_details?.name ||
        session.customer?.name ||
        session.metadata?.donor_name ||
        '',
      interval,
    });
  } catch (error) {
    console.error('Failed to retrieve Stripe session', error);
    res.status(500).json({ error: error.message || 'Unable to load Stripe session.' });
  }
});

app.get('/api/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`CropCarbon portal listening on http://localhost:${port}`);
});
