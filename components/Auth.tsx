
import React, { useState } from 'react';
import { login, register, validateEmail, validatePasswordStrength } from '../services/authService';
import { User, AuthMode } from '../types';

interface AuthProps {
  onAuthComplete: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    realName: '',
    identifier: '', // Email, Username, or Mobile
    email: '',
    password: '',
    phoneNumber: '',
    affiliation: ''
  });

  const getPasswordStrength = () => {
    if (!formData.password) return null;
    const isStrong = validatePasswordStrength(formData.password);
    return isStrong ? 
      <span className="text-emerald-500 text-[10px] font-bold">STRONG_CIPHER_OK</span> : 
      <span className="text-rose-500 text-[10px] font-bold">WEAK_VULNERABILITY</span>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'signup') {
      if (!formData.username) return setError('Unique Username is required.');
      if (!validateEmail(formData.email)) return setError('Invalid email format.');
      if (!validatePasswordStrength(formData.password)) return setError('Password must be 8+ chars with uppercase, numbers, and symbols.');
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(formData.identifier, formData.password);
        onAuthComplete(user);
      } else if (mode === 'signup') {
        const user = await register({
          username: formData.username,
          realName: formData.realName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          affiliation: formData.affiliation
        });
        onAuthComplete(user);
      }
    } catch (err: any) {
      setError(err.message || 'Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
      
      <header className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-100 mono uppercase tracking-tighter italic">
          {mode === 'login' ? '>> START_AUTH' : '>> CREATE_NODE'}
        </h2>
        <p className="text-zinc-500 text-xs mt-2 mono">Secure connection: TLS 1.3 | AES-256</p>
      </header>

      {error && (
        <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-[10px] font-bold text-center">
          [!] ERR: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'login' ? (
          <>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">Username / Email / Mobile</label>
              <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.identifier} onChange={(e) => setFormData({...formData, identifier: e.target.value})} />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">Unique Username</label>
                <input required type="text" placeholder="@handle" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">Real Name</label>
                <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.realName} onChange={(e) => setFormData({...formData, realName: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">Email Node</label>
              <input required type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">Mobile Secure Link</label>
              <input required type="tel" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
            </div>
          </>
        )}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase ml-1">Access Token (Password)</label>
            {mode === 'signup' && getPasswordStrength()}
          </div>
          <input required type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mono tracking-widest text-xs">
          {loading ? 'EXECUTING...' : mode === 'login' ? 'INIT_SESSION' : 'DEPLOY_NODE'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-zinc-800 text-center space-y-3">
        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-emerald-500 hover:text-emerald-400 text-xs font-bold transition-colors uppercase tracking-widest">
          {mode === 'login' ? "[ Register New Researcher ]" : "[ Return to Login ]"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
