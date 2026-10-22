import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'mechanic'>('owner');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, fullName, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#000000] border border-[#3A3634] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4C4643] border border-[#A5A78F]/40 font-mono text-xl font-bold text-[#F0EFED] mb-3">
            Y
          </div>
          <h2 className="text-xl font-bold text-[#F0EFED] font-mono tracking-wider">CREATE ACCOUNT</h2>
          <p className="text-xs text-[#A5A78F] mt-1">Get started with YANAMA Intelligence</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-700/50 flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A5A78F] mb-1 font-mono">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A5A78F] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aditya Sharma"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] placeholder-[#A5A78F]/50 focus:outline-none focus:border-[#A5A78F]"
              />
            </div>
          </div>

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
            <label className="block text-xs font-medium text-[#A5A78F] mb-1 font-mono">Password</label>
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

          <div>
            <label className="block text-xs font-medium text-[#A5A78F] mb-1 font-mono">Primary Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  role === 'owner'
                    ? 'bg-[#4C4643] border-[#A5A78F] text-[#F0EFED]'
                    : 'bg-[#1D1D1D] border-[#3A3634] text-[#A5A78F]'
                }`}
              >
                Car Owner
              </button>
              <button
                type="button"
                onClick={() => setRole('mechanic')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  role === 'mechanic'
                    ? 'bg-[#4C4643] border-[#A5A78F] text-[#F0EFED]'
                    : 'bg-[#1D1D1D] border-[#3A3634] text-[#A5A78F]'
                }`}
              >
                Trainee Mechanic
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider hover:bg-[#F0EFED] transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#A5A78F]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#F0EFED] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
