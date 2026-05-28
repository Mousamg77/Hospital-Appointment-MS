import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge } from '../../components/common/UI';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  ClipboardCheck, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <Card className="flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-end gap-2">
        <h3 className="text-2xl font-bold text-slate-900 leading-none">{value}</h3>
        {trend && <span className="text-[10px] font-bold text-emerald-500 mb-0.5 flex items-center gap-0.5"><TrendingUp size={10}/> {trend}</span>}
      </div>
    </div>
  </Card>
);

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Hello, {user?.name}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your health today.</p>
        </div>
        <Link to="/doctors">
          <Button icon={PlusCircle} className="bg-brand-500 text-white">Book New Appointment</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Calendar} 
          label="Appointments" 
          value="04" 
          color="bg-brand-50 text-brand-500" 
          trend="+1 this week"
        />
        <StatCard 
          icon={ClipboardCheck} 
          label="Completed" 
          value="12" 
          color="bg-emerald-50 text-emerald-500" 
        />
        <StatCard 
          icon={Stethoscope} 
          label="Prescriptions" 
          value="08" 
          color="bg-rose-50 text-rose-500" 
        />
        <StatCard 
          icon={Activity} 
          label="Health Score" 
          value="94%" 
          color="bg-amber-50 text-amber-500" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
            <Link to="/history" className="text-sm font-bold text-brand-600 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
             {/* Sample Upcoming Appointment */}
             <Card className="flex items-center gap-6" noPadding>
                <div className="w-2 bg-brand-500 rounded-l-2xl h-24"></div>
                <div className="flex-1 py-4 flex items-center justify-between pr-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">DS</div>
                      <div>
                         <h4 className="font-bold text-slate-900">Dr. Sarah Adams</h4>
                         <p className="text-xs text-brand-500 font-semibold mb-1">Cardiologist</p>
                         <div className="flex items-center gap-3 text-slate-400 text-[11px] font-medium">
                            <span className="flex items-center gap-1"><Calendar size={12}/> May 24, 2024</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> 10:00 AM</span>
                         </div>
                      </div>
                   </div>
                   <Badge variant="blue">Confirmed</Badge>
                </div>
             </Card>

             <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                   <Calendar size={32} />
                </div>
                <p className="text-slate-400 font-medium">No other appointments scheduled.</p>
                <Link to="/doctors">
                   <Button variant="ghost" size="sm" className="mt-2 text-brand-600">Find a doctor</Button>
                </Link>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Health Tips</h2>
          <Card className="bg-gradient-to-br from-brand-600 to-brand-400 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-lg mb-2">Stay Hydrated! 💧</h3>
                <p className="text-brand-50 text-sm leading-relaxed opacity-90">
                   Drinking 8 glasses of water a day helps maintain your energy levels and keeps your skin glowing.
                </p>
                <Button variant="secondary" size="sm" className="mt-4 border-none bg-white/20 text-white hover:bg-white/30">Read More</Button>
             </div>
             <Activity size={80} className="absolute -bottom-4 -right-4 text-white/10" />
          </Card>

          <Card className="space-y-4">
             <h3 className="text-base">Quick Links</h3>
             <div className="space-y-2">
                {['Emergency Call', 'Nearest Pharmacy', 'Health Insurance', 'Settings'].map(link => (
                   <button key={link} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors flex items-center justify-between group">
                      {link}
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Fixed import for PlusCircle
import { PlusCircle as PlusCircleIcon } from 'lucide-react';
const PlusCircle = PlusCircleIcon;
