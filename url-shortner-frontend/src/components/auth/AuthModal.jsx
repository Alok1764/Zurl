import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { login, register } from '../../api/auth.js';
import useAuthStore from '../../store/authStore.js';
import { useToast } from '../../context/ToastContext.jsx';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const setUser = useAuthStore((s) => s.setUser);
  const { addToast } = useToast();

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = tab === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password });
      setUser(user);
      addToast({ message: `Welcome${user?.name ? ', ' + user.name.split(' ')[0] : ''}! 🎉`, variant: 'success' });
      onClose();
    } catch (err) {
      addToast({ message: err.message || 'Authentication failed. Try again.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={420}>
      <div style={{ margin: '-24px' }}>
        <div className="auth-tabs">
          <button id="auth-tab-login" className={`auth-tab${tab === 'login' ? ' auth-tab--active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button id="auth-tab-signup" className={`auth-tab${tab === 'signup' ? ' auth-tab--active' : ''}`} onClick={() => setTab('signup')}>Sign up</button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <Input id="auth-name" label="Name" placeholder="Alok Pal" value={form.name} onChange={handleChange('name')} autoComplete="name" disabled={loading} />
          )}
          <Input id="auth-email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange('email')} autoComplete="email" disabled={loading} />
          <Input id="auth-password" label="Password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange('password')} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} disabled={loading} />
          <Button id="auth-submit-btn" type="submit" variant="primary" fullWidth loading={loading}>
            {tab === 'login' ? 'Login' : 'Create account'}
          </Button>
          <p className="auth-form__footer">{tab === 'login' ? "No account? It's free." : 'Already have one? Switch to login.'}</p>
        </form>
      </div>
    </Modal>
  );
}
