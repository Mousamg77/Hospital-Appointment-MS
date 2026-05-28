import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  UserRound, 
  CalendarDays, 
  ClipboardList, 
  Stethoscope, 
  Settings,
  LogOut,
  PlusCircle,
  Users
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-200' 
        : 'text-slate-500 hover:bg-brand-50 hover:text-brand-600'
    }`}
  >
    <Icon size={20} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-medium">{label}</span>
  </Link>
);

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    if (!user) return [];
    if (user.role === 'PATIENT') {
      return [
        { to: '/patient', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/doctors', icon: Stethoscope, label: 'Find Doctors' },
        { to: '/history', icon: ClipboardList, label: 'My Health Records' },
      ];
    }
    if (user.role === 'DOCTOR') {
      return [
        { to: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/doctor/appointments', icon: CalendarDays, label: 'Appointments' },
      ];
    }
    if (user.role === 'ADMIN') {
      return [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/doctors', icon: Users, label: 'Manage Doctors' },
        { to: '/admin/appointments', icon: ClipboardList, label: 'All Appointments' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white h-screen sticky top-0 border-r border-slate-100 flex flex-col p-4 z-40">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
          <Stethoscope className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400 font-display">
          MediLink
        </span>
      </div>

      <div className="flex-1 space-y-2">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.to} 
            {...item} 
            active={location.pathname === item.to} 
          />
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <SidebarItem to="/profile" icon={UserRound} label="Profile" active={location.pathname === '/profile'} />
        <button
          onClick={logout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
