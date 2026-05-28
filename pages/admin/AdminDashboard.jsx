import { useState, useEffect } from 'react';
import { getDoctors, adminAddDoctor, adminUpdateDoctor, adminDeleteDoctor, adminGetAppointments } from '../../api/api';
import { Card, Button, Badge } from '../../components/common/UI';
import { 
  Plus, 
  Users, 
  CalendarDays, 
  Search, 
  Edit3, 
  Trash2, 
  Filter, 
  Mail, 
  Smartphone,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

const STATUS_VARIANTS = {
  PENDING: 'amber',
  APPROVED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'rose',
};

const EMPTY_DOC = { name: '', email: '', password: '', specialization: '', experienceYears: '', phone: '', availableDays: '' };

export default function AdminDashboard() {
  const [tab, setTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_DOC);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDoctors = () => getDoctors().then(res => setDoctors(res.data.data));
  const loadAppts = () => adminGetAppointments().then(res => {
     setAppointments(res.data.data);
     setLoading(false);
  });

  useEffect(() => { loadDoctors(); loadAppts(); }, []);

  const handleSave = async () => {
    try {
      if (editId) {
        await adminUpdateDoctor(editId, form);
        setMsg('Doctor updated successfully');
      } else {
        await adminAddDoctor(form);
        setMsg('New doctor registered');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY_DOC);
      loadDoctors();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await adminDeleteDoctor(id);
      setMsg('Doctor record deleted');
      loadDoctors();
    } catch {
      setMsg('Failed to delete');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Hospital Administration</h1>
          <p className="text-slate-500 mt-1">Control hospital resources, staff, and overall appointment traffic.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           <button onClick={() => setTab('doctors')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                 tab === 'doctors' ? 'bg-brand-500 text-white shadow-lg shadow-brand-100' : 'text-slate-500 hover:bg-slate-50'
              }`}>
              <Users size={16} /> Doctors
           </button>
           <button onClick={() => setTab('appointments')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                 tab === 'appointments' ? 'bg-brand-500 text-white shadow-lg shadow-brand-100' : 'text-slate-500 hover:bg-slate-50'
              }`}>
              <CalendarDays size={16} /> All Visits
           </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-brand-50 border border-brand-100 text-brand-700 rounded-2xl text-sm font-bold flex justify-between">
           {msg}
           <button onClick={() => setMsg('')} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {tab === 'doctors' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Medical Staff</p>
                 <h3 className="text-3xl font-extrabold text-slate-900 font-display">{doctors.length} Doctors</h3>
              </div>
              <Button icon={Plus} onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_DOC); }}>
                 Register New Doctor
              </Button>
           </div>

           {showForm && (
              <Card className="animate-in slide-in-from-top-4 duration-500 border-2 border-brand-100">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                       {editId ? 'Modify Doctor Credentials' : 'New Specialist Registration'}
                    </h3>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[
                      ['name', 'Full Name', 'Dr. Smith'], ['email', 'Email Address', 'doc@hospital.com'], 
                      ['password', 'Auth Password', '••••••••'],
                      ['specialization', 'Specialty', 'Cardiology'], ['experienceYears', 'Experience (Years)', '10'],
                      ['phone', 'Direct Phone', '+1 234 567'], ['availableDays', 'Duty Days', 'Mon, Wed, Fri']
                    ].map(([key, label, placeholder]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-tight">{label}</label>
                        <input
                          type={key === 'password' ? 'password' : 'text'}
                          value={form[key]}
                          placeholder={placeholder}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand-500/10 text-sm font-medium"
                        />
                      </div>
                    ))}
                 </div>
                 <div className="flex gap-3 justify-end pt-6 border-t border-slate-50">
                    <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button onClick={handleSave} icon={ShieldCheck}>{editId ? 'Update Record' : 'Complete Registration'}</Button>
                 </div>
              </Card>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(doc => (
                <Card key={doc.id} className="group hover:shadow-xl transition-all duration-300" noPadding>
                   <div className="p-6 flex items-start gap-4">
                      <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 text-2xl font-bold border border-brand-100 flex-shrink-0">
                         {doc.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-slate-900 truncate">Dr. {doc.name}</h4>
                         <p className="text-xs font-bold text-brand-500 uppercase tracking-tighter mb-3 truncate">{doc.specialization}</p>
                         <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium"><Mail size={12}/> {doc.email}</div>
                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium"><Smartphone size={12}/> {doc.phone || 'N/A'}</div>
                         </div>
                      </div>
                   </div>
                   <div className="px-6 py-4 bg-slate-50/50 flex gap-2">
                      <Button size="sm" variant="secondary" className="flex-1 bg-white" icon={Edit3}
                         onClick={() => { setEditId(doc.id); setForm({ ...doc, password: '' }); setShowForm(true); }}>
                         Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-500 hover:bg-rose-50" icon={Trash2}
                         onClick={() => handleDelete(doc.id)}></Button>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      )}

      {tab === 'appointments' && (
        <Card noPadding className="overflow-hidden">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Appointment Ledger</h3>
              <div className="relative group">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" placeholder="Search visits..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs" />
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <th className="px-6 py-4">Ref. ID</th>
                       <th className="px-6 py-4">Patient Profile</th>
                       <th className="px-6 py-4">Assigned Specialist</th>
                       <th className="px-6 py-4">Schedule</th>
                       <th className="px-6 py-4">Current Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan={5} className="h-16 bg-slate-50/20"></td></tr>)
                    ) : appointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 text-xs font-bold text-slate-400">#{appt.id}</td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">PT</div>
                               <span className="text-sm font-bold text-slate-700">{appt.patientName}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-[10px] font-bold text-brand-600"><Stethoscope size={12}/></div>
                               <div>
                                  <p className="text-sm font-bold text-slate-700">Dr. {appt.doctorName}</p>
                                  <p className="text-[10px] font-semibold text-brand-500 uppercase">{appt.specialization}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-700">{appt.appointmentDate}</p>
                            <p className="text-[10px] font-medium text-slate-400">{appt.timeSlot}</p>
                         </td>
                         <td className="px-6 py-4">
                            <Badge variant={STATUS_VARIANTS[appt.status]}>{appt.status}</Badge>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      )}
    </div>
  );
}
