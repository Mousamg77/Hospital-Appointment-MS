import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Search for something..." 
          className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-100"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1 capitalize">{user?.role.toLowerCase()}</p>
          </div>
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 border border-brand-200">
            <User size={20} />
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
