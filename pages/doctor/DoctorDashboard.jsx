import { useState, useEffect } from 'react';
import { getDoctorAppointments, updateAppointmentStatus, addPrescription } from '../../api/api';
import { Card, Button, Badge } from '../../components/common/UI';
import { 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal, 
  ClipboardList,
  Pill,
  MessageSquare
} from 'lucide-react';

const STATUS_VARIANTS = {
  PENDING: 'amber',
  APPROVED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'rose',
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rxForm, setRxForm] = useState({ medicineDetails: '', notes: '' });
  const [showRxFor, setShowRxFor] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgIsError, setMsgIsError] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    getDoctorAppointments()
      .then(res => setAppointments(res.data.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusUpdate = async (apptId, status, notes = '') => {
    setUpdatingId(apptId);
    setMsg('');
    setMsgIsError(false);
    try {
      await updateAppointmentStatus(apptId, { status, notes });
      setMsg('Status updated successfully!');
      load();
    } catch (err) {
      setMsgIsError(true);
      setMsg(err.response?.data?.message || 'Failed to update. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddPrescription = async (apptId) => {
    try {
      await addPrescription({ appointmentId: String(apptId), ...rxForm });
      setMsgIsError(false);
      setMsg('Prescription saved!');
      setShowRxFor(null);
      load();
    } catch (err) {
      setMsgIsError(true);
      setMsg(err.response?.data?.message || 'Failed to save prescription.');
    }
  };

  const filtered = filter === 'ALL' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  const stats = [
    { label: 'Total Patients', value: appointments.length, icon: Users, color: 'bg-brand-50 text-brand-500' },
    { label: 'Pending', value: appointments.filter(a => a.status === 'PENDING').length, icon: Clock, color: 'bg-amber-50 text-amber-500' },
    { label: 'Today', value: appointments.filter(a => a.appointmentDate === new Date().toISOString().split('T')[0]).length, icon: Calendar, color: 'bg-emerald-50 text-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Doctor Panel</h1>
          <p className="text-slate-500 mt-1">Manage your patient schedule and medical prescriptions.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100">
           {['ALL', 'PENDING', 'APPROVED', 'COMPLETED'].map(f => (
             <button
               key={f} onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                 filter === f ? 'bg-brand-500 text-white shadow-lg shadow-brand-100' : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-2xl text-sm font-bold flex items-center justify-between animate-in slide-in-from-top-2 border ${
            msgIsError
              ? 'bg-rose-50 border-rose-100 text-rose-700'
              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
          }`}
        >
           <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              {msg}
           </div>
           <button type="button" onClick={() => { setMsg(''); setMsgIsError(false); }} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 leading-none">{s.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Upcoming Visit Requests</h2>
        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-20 bg-slate-50/50 border-dashed">
            <p className="text-slate-400 font-medium">No appointments found in this category.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map(appt => (
              <Card key={appt.id} noPadding className="overflow-hidden group hover:border-brand-200 transition-all duration-300">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-50">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-lg">
                            {appt.patientName.charAt(0)}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">{appt.patientName}</h4>
                            <p className="text-xs text-slate-400 font-medium tracking-tight flex items-center gap-1.5 uppercase">
                               <Calendar size={12} /> {appt.appointmentDate} · <Clock size={12} /> {appt.timeSlot}
                            </p>
                         </div>
                      </div>
                      <Badge variant={STATUS_VARIANTS[appt.status]}>{appt.status}</Badge>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <MessageSquare size={10} /> Reason for Visit
                       </p>
                       <p className="text-sm text-slate-600 font-medium">"{appt.reason || 'No reason provided.'}"</p>
                    </div>
                  </div>

                  <div className="w-full md:w-64 p-6 bg-slate-50/30 flex flex-col justify-center gap-2">
                    {appt.status === 'PENDING' && (
                      <Button 
                        variant="primary" 
                        size="sm" icon={CheckCircle2} 
                        className="w-full"
                        loading={updatingId === appt.id}
                        disabled={updatingId != null}
                        onClick={() => handleStatusUpdate(appt.id, 'APPROVED')}
                      >
                        Approve
                      </Button>
                    )}
                    {(appt.status === 'APPROVED') && (
                      <Button 
                         variant="success" 
                         size="sm" icon={CheckCircle2}
                         className="w-full"
                         loading={updatingId === appt.id}
                         disabled={updatingId != null}
                         onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {appt.status === 'COMPLETED' && (
                      <Button 
                        variant="secondary" 
                        size="sm" icon={Pill} 
                        className="w-full border-brand-200 text-brand-600 font-bold"
                        onClick={() => { setShowRxFor(appt.id); setRxForm({ medicineDetails: '', notes: '' }) }}
                      >
                        Manage Rx
                      </Button>
                    )}
                    {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                      <Button 
                        variant="ghost" 
                        size="sm" icon={XCircle} 
                        className="w-full text-slate-400 hover:text-rose-500"
                        loading={updatingId === appt.id}
                        disabled={updatingId != null}
                        onClick={() => {
                          if (!window.confirm('Reject this appointment request? The patient will see it as cancelled.')) return;
                          handleStatusUpdate(appt.id, 'CANCELLED');
                        }}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>

                {/* Rx Modal Mock */}
                {showRxFor === appt.id && (
                  <div className="p-6 bg-emerald-50 border-t border-emerald-100 animate-in slide-in-from-bottom-2 space-y-4">
                     <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                        <Pill size={18} /> Add Prescription & Treatment
                     </h4>
                     <div className="grid gap-3">
                        <textarea 
                           placeholder="Medicine, Dosage, and Duration..." 
                           value={rxForm.medicineDetails}
                           onChange={(e) => setRxForm({ ...rxForm, medicineDetails: e.target.value })}
                           className="w-full p-4 bg-white border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium resize-none shadow-sm"
                           rows={2}
                        />
                        <textarea 
                           placeholder="Treatment notes or next steps..." 
                           value={rxForm.notes}
                           onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })}
                           className="w-full p-4 bg-white border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium resize-none shadow-sm"
                           rows={2}
                        />
                     </div>
                     <div className="flex gap-2">
                        <Button 
                           variant="success" 
                           size="sm" 
                           icon={CheckCircle2}
                           onClick={() => handleAddPrescription(appt.id)}
                        >
                           Save Prescription
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setShowRxFor(null)}>Discard</Button>
                     </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
