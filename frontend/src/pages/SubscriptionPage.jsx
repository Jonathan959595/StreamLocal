import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authService, subscriptionService } from '../services/api';
import { updateUser } from '../redux/store';

const plans = [
  { id: 'basic', name: 'Basic', price: '4.99', features: ['720p HD streaming', '1 device stream at a time', 'Unlimited catalog access'] },
  { id: 'standard', name: 'Standard', price: '9.99', features: ['1080p Full HD streaming', '2 device streams at a time', 'Download & resume on any profile'] },
  { id: 'premium', name: 'Premium', price: '14.99', features: ['4K Ultra HD & HDR', '4 simultaneous streams', 'Dedicated Kids & Family profiles'] },
];

export default function SubscriptionPage() {
  const session = useSelector((state) => state.auth);
  const currentSub = session?.user?.subscription;
  const isCurrentlyActive = currentSub?.status === 'ACTIVE' && new Date(currentSub.expiresAt) > new Date();

  const [plan, setPlan] = useState(currentSub?.planId || 'standard');
  const [form, setForm] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/28',
    cvv: '123',
    cardholderName: session?.user?.email ? session.user.email.split('@')[0] : 'Demo User',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selected = plans.find((entry) => entry.id === plan) || plans[1];

  const field = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (!session?.token) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }

    if (form.cardNumber.replace(/\s/g, '').length < 12 || form.cvv.length < 3 || !form.expiryDate || !form.cardholderName.trim()) {
      return setMessage('Please complete the demo payment fields.');
    }

    setLoading(true);
    setMessage('');

    try {
      await subscriptionService.checkout({
        cardNumber: form.cardNumber.replace(/\s/g, ''),
        cvv: form.cvv,
        expiryDate: form.expiryDate,
        cardholderName: form.cardholderName,
        planId: plan,
        paymentMethod: 'card',
      });

      const me = await authService.me(session.token);
      if (me?.data) {
        dispatch(updateUser(me.data));
      }
      setComplete(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to activate subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="subscription-page">
      <div>
        <p className="eyebrow">Choose your experience</p>
        <h1>Entertainment without interruption.</h1>

        {isCurrentlyActive && (
          <div className="active-sub-banner">
            <span className="active-badge">Active Subscription</span>
            <p>
              Your <strong>{currentSub.planName || 'Current'} Plan</strong> is active until{' '}
              {new Date(currentSub.expiresAt).toLocaleDateString()}. You can change your plan below.
            </p>
          </div>
        )}

        <div className="plan-grid">
          {plans.map((entry) => (
            <button
              type="button"
              className={`plan-card ${plan === entry.id ? 'selected' : ''}`}
              onClick={() => setPlan(entry.id)}
              key={entry.id}
            >
              <h2>{entry.name}</h2>
              <strong>
                ${entry.price}
                <small>/month</small>
              </strong>
              {entry.features.map((feature) => (
                <span key={feature}>✓ {feature}</span>
              ))}
            </button>
          ))}
        </div>
      </div>

      <form className="checkout-card" onSubmit={submit}>
        {complete ? (
          <div className="checkout-success">
            <p className="eyebrow">You’re all set</p>
            <h2>Welcome to {selected.name}</h2>
            <p>Your subscription is active and ready to stream in full resolution.</p>
            <button className="button button-main" type="button" onClick={() => navigate('/')}>
              Start watching
            </button>
          </div>
        ) : !session ? (
          <div className="checkout-guest">
            <p className="eyebrow">StreamLocal Membership</p>
            <h2>Sign in to continue</h2>
            <p>Create an account or sign in to choose a streaming plan.</p>
            <div className="button-row">
              <Link className="button button-main" to="/login" state={{ from: '/subscription' }}>
                Sign In
              </Link>
              <Link className="button button-muted" to="/register" state={{ from: '/subscription' }}>
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="eyebrow">Simulated checkout</p>
            <h2>{selected.name} plan — ${selected.price}/mo</h2>
            <div className="payment-method">
              Credit / Debit Card <span>Demo Mode</span>
            </div>

            <label>
              Cardholder name
              <input autoComplete="cc-name" value={form.cardholderName} onChange={field('cardholderName')} />
            </label>

            <label>
              Card number
              <input
                autoComplete="cc-number"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={form.cardNumber}
                onChange={field('cardNumber')}
              />
            </label>

            <div className="payment-split">
              <label>
                Expiry date
                <input autoComplete="cc-exp" placeholder="MM / YY" value={form.expiryDate} onChange={field('expiryDate')} />
              </label>
              <label>
                CVV
                <input autoComplete="cc-csc" inputMode="numeric" maxLength="4" placeholder="123" value={form.cvv} onChange={field('cvv')} />
              </label>
            </div>

            {message && <p className="form-message error">{message}</p>}

            <button className="button button-main" disabled={loading}>
              {loading ? 'Activating…' : `Start ${selected.name}`}
            </button>
            <small>Server-controlled simulated billing. No real payment credentials required.</small>
          </>
        )}
      </form>
    </main>
  );
}
