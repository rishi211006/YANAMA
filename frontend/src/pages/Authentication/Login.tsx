import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Wrench, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'owner' | 'mechanic') => {
    setError(null);
    setLoading(true);
    try {
      await loginDemo(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Could not connect to backend server. Make sure API is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#000000] border border-[#3A3634] rounded-2xl shadow-2xl p-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4C4643] border border-[#A5A78F]/40 font-mono text-xl font-bold text-[#F0EFED] mb-3 shadow-inner">
            Y
          </div>
          <h2 className="text-xl font-bold text-[#F0EFED] font-mono tracking-wider">YANAMA SIGN IN</h2>
          <p className="text-xs text-[#A5A78F] mt-1">Vehicle Intelligence & Analytics Console</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-700/50 flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Demo Buttons */}
        <div className="mb-6 space-y-2">
          <div className="text-[11px] font-mono text-[#A5A78F] uppercase tracking-wider text-center mb-2">
            Instant One-Click Demo Access
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemo('owner')}
              className="px-3 py-2.5 rounded-xl bg-[#4C4643]/70 hover:bg-[#4C4643] border border-[#3A3634] hover:border-[#A5A78F]/40 transition text-xs font-semibold text-[#F0EFED] flex items-center justify-center space-x-1.5"
            >
              <Car className="w-3.5 h-3.5 text-[#A5A78F]" />
              <span>Owner Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('mechanic')}
              className="px-3 py-2.5 rounded-xl bg-[#4C4643]/70 hover:bg-[#4C4643] border border-[#3A3634] hover:border-[#A5A78F]/40 transition text-xs font-semibold text-[#F0EFED] flex items-center justify-center space-x-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-[#A5A78F]" />
              <span>Mechanic Demo</span>
            </button>
          </div>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#3A3634]" /></div>
          <span className="relative px-3 text-[10px] uppercase font-mono bg-[#000000] text-[#A5A78F]">Or Login with Password</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A5A78F] mb-1 font-mono">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A5A78F] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] placeholder-[#A5A78F]/50 focus:outline-none focus:border-[#A5A78F]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#A5A78F] font-mono">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-[#A5A78F] hover:text-[#F0EFED]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A5A78F] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] placeholder-[#A5A78F]/50 focus:outline-none focus:border-[#A5A78F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider hover:bg-[#F0EFED] transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#A5A78F]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F0EFED] font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
