import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const { state } = useLocation();

  if (user) return <Navigate to={state?.from || '/'} replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      if (mode === 'login') await login(f.email, f.password);
      else await register(f.name, f.email, f.password);
      nav(state?.from || '/', { replace: true });
    } catch (e2) { setErr(e2.message); }
  };

  return (
    <form onSubmit={submit} className="form narrow">
      <h1>{mode === 'login' ? 'Log in' : 'Create account'}</h1>
      {mode === 'register' && <input required placeholder="Name" value={f.name} onChange={set('name')} />}
      <input required type="email" placeholder="Email" value={f.email} onChange={set('email')} />
      <input required type="password" minLength={6} placeholder="Password (min 6 characters)" value={f.password} onChange={set('password')} />
      {err && <p className="err">{err}</p>}
      <button>{mode === 'login' ? 'Log in' : 'Sign up'}</button>
      <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
        {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
      </button>
    </form>
  );
}
