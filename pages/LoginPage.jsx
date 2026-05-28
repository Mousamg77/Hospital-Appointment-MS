import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/common/UI';
import { Mail, Lock, Stethoscope, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      const { token, role, name, userId } = res.data.data;
      authLogin({ token, role, name, id: userId });
      
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'DOCTOR') navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. Make sure the backend is running on port 8081.');
      } else if (err.response.status === 403) {
        setError('Session expired. Please refresh the page and try again.');
      } else {
        const data = err.response.data;
        const msg = data?.message
          || (data?.data && typeof data.data === 'object' ? Object.values(data.data).join(', ') : null);
        setError(msg || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Decoration Section */}
      <div className="hidden lg:flex flex-col bg-brand-500 p-12 text-white items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-400/50 rounded-full -ml-48 -mb-48"></div>
        
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Stethoscope size={40} />
          </div>
          <h1 className="text-4xl font-extrabold mb-6 font-display">Better Health, Better Life</h1>
          <p className="text-brand-100 text-lg leading-relaxed">
            Welcome to MediLink. Manage your hospital appointments, view medical history, and connect with top specialized doctors.
          </p>
        </div>
        
        <div className="absolute bottom-12 left-12 flex gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-500 bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-600">
                User
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-brand-50">Join 10k+ satisfied patients</p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-display">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-slate-300"
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
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500 transition-all" />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-brand-600 hover:text-brand-700">Forgot Password?</a>
            </div>

            <Button type="submit" loading={loading} className="w-full py-4 text-base" icon={ArrowRight}>
              Login Account
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
              Join for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
