import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#1D1D1D] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#000000] border border-[#3A3634] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#F0EFED] font-mono tracking-wider">RESET PASSWORD</h2>
          <p className="text-xs text-[#A5A78F] mt-1">We will send you instructions to recover access.</p>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#F0EFED]">Recovery Email Dispatched</h4>
            <p className="text-xs text-[#A5A78F] mt-1">
              If an account matches <span className="text-[#F0EFED] font-mono">{email}</span>, a secure password reset link has been delivered.
            </p>
            <Link to="/login" className="inline-block mt-4 text-xs font-semibold text-[#A5A78F] hover:text-[#F0EFED]">
              &larr; Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A5A78F] mb-1 font-mono">Registered Email</label>
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

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider hover:bg-[#F0EFED] transition flex items-center justify-center space-x-2"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-[#A5A78F] hover:text-[#F0EFED]">
                Remember password? Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
