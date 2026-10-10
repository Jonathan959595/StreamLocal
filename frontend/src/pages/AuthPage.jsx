import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../services/api';
import { setSession } from '../redux/store';

export default function AuthPage({ mode = 'login' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = mode === 'register';

  const [form, setForm] = useState({
    name: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState(location.state?.message || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setForm((prev) => ({ ...prev, email: location.state.email }));
    }
    if (location.state?.message) {
      setStatus(location.state.message);
    }
  }, [location.state]);

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (error) setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    const trimmedEmail = form.email.trim();
    if (isRegister && !form.name.trim()) return setError('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (isRegister && form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      if (isRegister) {
        await authService.register({
          email: trimmedEmail,
          password: form.password,
        });
        // Registration successful! Redirect to login with prefilled email
        navigate('/login', {
          replace: true,
          state: {
            email: trimmedEmail,
            message: 'Account created successfully! Please enter your password to sign in.',
          },
        });
        return;
      }

      // Login flow
      const response = await authService.login({
        email: trimmedEmail,
        password: form.password,
      });

      const token = response.data?.token;
      if (!token) {
        throw new Error('Authentication token not received.');
      }

      let userData = response.data?.user;
      try {
        const meResponse = await authService.me(token);
        if (meResponse?.data) {
          userData = meResponse.data;
        }
      } catch {
        // Fall back to login user payload if me call fails
      }

      const activeProfileId = userData?.profiles?.[0]?.profileId || null;
      dispatch(
        setSession({
          token,
          user: userData,
          selectedProfileId: activeProfileId,
        })
      );

      const targetPath = location.state?.from || '/profiles';
      navigate(targetPath, { replace: true });
    } catch (err) {
      if (!err.response) {
        setError('Unable to reach StreamLocal server. Please ensure the backend is running.');
      } else if (err.response.status === 401) {
        setError('Incorrect email or password.');
      } else if (err.response.status === 409) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(err.response.data?.message || 'Authentication could not be completed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand" to="/">
          Stream<span>Local</span>
        </Link>
        <p className="eyebrow">Your local cinema</p>
        <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>

        {isRegister && (
          <label>
            Name
            <input
              autoComplete="name"
              placeholder="Your name"
              value={form.name}
              onChange={updateField('name')}
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField('email')}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder="At least 6 characters"
            value={form.password}
            onChange={updateField('password')}
          />
        </label>

        {isRegister && (
          <label>
            Confirm password
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={updateField('confirmPassword')}
            />
          </label>
        )}

        {error && (
          <p className="form-message error" role="alert">
            {error}
          </p>
        )}
        {status && (
          <p className="form-message success" role="status">
            {status}
          </p>
        )}

        <button className="button button-main" disabled={loading}>
          {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
        </button>

        <p>
          {isRegister ? 'Already have an account?' : 'New to StreamLocal?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </form>
    </main>
  );
}
