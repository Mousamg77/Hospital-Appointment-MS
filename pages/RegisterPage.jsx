import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/UI';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PATIENT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      const { token, role, name, userId } = res.data.data;
      authLogin({ token, role, name, id: userId });
      navigate(role === 'ADMIN' ? '/admin' : role === 'DOCTOR' ? '/doctor' : '/patient');
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. Make sure the backend is running on port 8081.');
      } else if (err.response.status === 403) {
        setError('Session expired. Please refresh the page and try again.');
      } else {
        const data = err.response.data;
        const msg = data?.message
          || (data?.data && typeof data.data === 'object' ? Object.values(data.data).join(', ') : null);
        setError(msg || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Right Decor (hidden mobile) */}
      <div className="hidden lg:flex flex-col bg-brand-500 p-12 text-white items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400/50 rounded-full -mr-48 -mb-48"></div>
        
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <User size={40} />
          </div>
          <h1 className="text-4xl font-extrabold mb-6 font-display">Join our Community</h1>
          <p className="text-brand-100 text-lg">
            Create your account today and start managing your healthcare records and appointments with ease.
          </p>
        </div>
      </div>

      {/* Left Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-display">Create Account</h2>
            <p className="text-slate-500">Join thousands of happy users today</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password" required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700 block ml-1">I am a...</label>
               <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'PATIENT' })}
                    className={`py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                      form.role === 'PATIENT' 
                        ? 'bg-brand-50 border-brand-500 text-brand-600' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'DOCTOR' })}
                    className={`py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                      form.role === 'DOCTOR' 
                        ? 'bg-brand-50 border-brand-500 text-brand-600' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    Doctor
                  </button>
               </div>
            </div>

            <div className="pt-4">
              <Button type="submit" loading={loading} className="w-full py-4 text-base" icon={ArrowRight}>
                Create Account
              </Button>
            </div>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
