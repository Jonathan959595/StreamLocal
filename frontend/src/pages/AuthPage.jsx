import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../services/api';
import { setSession } from '../redux/store';

export default function AuthPage({ mode = 'login' }) {
  const dispatch = useDispatch();
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');
    if (isRegister && !form.name.trim()) return setError('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (isRegister && form.password !== form.confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    try {
      const response = await (isRegister ? authService.register(form) : authService.login(form));
      const session = response.data?.user || response.data?.token ? { user: response.data.user || null, token: response.data.token || null } : null;
      if (session) dispatch(setSession(session));
      setStatus('Connected successfully.');
    } catch {
      setError('Authentication is not available until the local backend is connected.');
    } finally {
      setLoading(false);
    }
  };
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><Link className="brand" to="/">Stream<span>Local</span></Link><p className="eyebrow">Your local cinema</p><h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>{isRegister && <label>Name<input autoComplete="name" value={form.name} onChange={updateField('name')} /></label>}<label>Email<input type="email" autoComplete="email" value={form.email} onChange={updateField('email')} /></label><label>Password<input type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={form.password} onChange={updateField('password')} /></label>{isRegister && <label>Confirm password<input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={updateField('confirmPassword')} /></label>}{error && <p className="form-message error" role="alert">{error}</p>}{status && <p className="form-message success" role="status">{status}</p>}<button className="button button-main" disabled={loading}>{loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button><p>{isRegister ? 'Already have an account?' : 'New to StreamLocal?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p></form></main>;
}
