
import React, { useState } from 'react';
import { changePassword, sendOTP, validatePasswordStrength } from '../services/authService';

const Settings: React.FC = () => {
  const [method, setMethod] = useState<'standard' | 'otp'>('standard');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const [passData, setPassData] = useState({
    old: '',
    newP: '',
    confirm: '',
    otp: ''
  });

  const handleStandardChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passData.newP !== passData.confirm) return setError("Passwords don't match.");
    if (!validatePasswordStrength(passData.newP)) return setError("New password is not strong enough.");

    setLoading(true);
    try {
      await changePassword(passData.old, passData.newP);
      setSuccess("Security credentials updated successfully.");
      setPassData({ old: '', newP: '', confirm: '', otp: '' });
    } catch (err) {
      setError("Failed to update credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPRequest = async () => {
    setLoading(true);
    try {
      await sendOTP("user@email.com"); // Real email from context
      setStep(2);
    } catch (err) {
      setError("OTP request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-zinc-100 mb-8">Security Hub</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="flex border-b border-zinc-800">
          <button onClick={() => {setMethod('standard'); setStep(1);}} className={`flex-grow py-4 text-xs font-bold uppercase tracking-widest ${method === 'standard' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
            Standard Update
          </button>
          <button onClick={() => {setMethod('otp'); setStep(1);}} className={`flex-grow py-4 text-xs font-bold uppercase tracking-widest ${method === 'otp' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
            OTP Verification
          </button>
        </div>

        <div className="p-8">
          {success && <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-xs font-bold text-center">{success}</div>}
          {error && <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-bold text-center">{error}</div>}

          {method === 'standard' ? (
            <form onSubmit={handleStandardChange} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Current Cipher (Old Password)</label>
                <input required type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200" value={passData.old} onChange={(e) => setPassData({...passData, old: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">New Cipher</label>
                  <input required type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200" value={passData.newP} onChange={(e) => setPassData({...passData, newP: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Confirm Cipher</label>
                  <input required type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200" value={passData.confirm} onChange={(e) => setPassData({...passData, confirm: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all">
                Update Cipher
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {step === 1 ? (
                <div className="text-center">
                  <p className="text-zinc-400 text-sm mb-6">Verify your identity via a secure 6-digit code to reset your password.</p>
                  <button onClick={handleOTPRequest} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl">
                    Dispatch Verification Code
                  </button>
                </div>
              ) : (
                <form onSubmit={handleStandardChange} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Enter Code</label>
                    <input required maxLength={6} type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-center text-xl font-mono" placeholder="000000" value={passData.otp} onChange={(e) => setPassData({...passData, otp: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">New Cipher</label>
                     <input required type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200" value={passData.newP} onChange={(e) => setPassData({...passData, newP: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl">
                    Authorize Change
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
