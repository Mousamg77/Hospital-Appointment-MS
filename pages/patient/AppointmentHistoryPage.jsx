import { useState, useEffect } from 'react';
import { getPatientAppointments, getPrescription } from '../../api/api';
import { Card, Button, Badge } from '../../components/common/UI';
import { Calendar, Clock, Stethoscope, ChevronDown, Download, FileText, Search } from 'lucide-react';

const STATUS_VARIANTS = {
  PENDING: 'amber',
  APPROVED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'rose',
};

export default function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState({});
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getPatientAppointments()
      .then(res => setAppointments(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const viewPrescription = async (apptId) => {
    if (prescriptions[apptId]) {
      setPrescriptions(prev => ({ ...prev, [apptId]: null }));
      return;
    }
    try {
      const res = await getPrescription(apptId);
      setPrescriptions(prev => ({ ...prev, [apptId]: res.data.data }));
    } catch {
      setPrescriptions(prev => ({ ...prev, [apptId]: 'NOT_FOUND' }));
    }
  };

  const filtered = filter === 'ALL' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Medical History</h1>
          <p className="text-slate-500 mt-1">Track your past consultations, prescriptions, and health progress.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           {['ALL', 'PENDING', 'APPROVED', 'COMPLETED'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                 filter === f 
                   ? 'bg-brand-500 text-white shadow-lg shadow-brand-100' 
                   : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
           {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-20 bg-slate-50/50 border-dashed">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
            <ClipboardList size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-400">No records found</h3>
        </Card>
      ) : (
        <div className="space-y-1">
           {/* Table Header */}
           <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 rounded-t-2xl">
              <div className="col-span-4">Doctor & Specialty</div>
              <div className="col-span-3">Date & Time</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-3 text-right">Actions</div>
           </div>

           <div className="space-y-3">
              {filtered.map(appt => (
                <Card key={appt.id} noPadding className="group hover:border-brand-200 transition-colors">
                  <div className="grid grid-cols-12 px-6 py-4 items-center">
                    <div className="col-span-4 flex items-center gap-3">
                       <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold text-sm">
                          {appt.doctorName.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-slate-800">Dr. {appt.doctorName}</p>
                          <p className="text-[11px] font-semibold text-brand-500 uppercase tracking-tight">{appt.specialization}</p>
                       </div>
                    </div>

                    <div className="col-span-3 flex flex-col gap-0.5">
                       <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                          <Calendar size={14} className="text-slate-400" />
                          {appt.appointmentDate}
                       </div>
                       <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                          <Clock size={14} />
                          {appt.timeSlot}
                       </div>
                    </div>

                    <div className="col-span-2 text-center">
                       <Badge variant={STATUS_VARIANTS[appt.status]}>{appt.status}</Badge>
                    </div>

                    <div className="col-span-3 flex justify-end gap-2">
                       {appt.status === 'COMPLETED' && (
                         <Button 
                           variant="secondary" size="sm" icon={FileText}
                           onClick={() => viewPrescription(appt.id)}
                           className={prescriptions[appt.id] ? 'bg-brand-500 text-white border-none' : ''}
                         >
                           {prescriptions[appt.id] ? 'Hide Rx' : 'View Rx'}
                         </Button>
                       )}
                       <Button variant="ghost" size="sm" icon={Download}></Button>
                    </div>
                  </div>

                  {prescriptions[appt.id] && prescriptions[appt.id] !== 'NOT_FOUND' && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                       <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100 flex gap-6">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-500 shadow-sm shadow-brand-100 flex-shrink-0">
                             <Stethoscope size={24} />
                          </div>
                          <div className="space-y-4 flex-1">
                             <div>
                                <h4 className="text-sm font-bold text-slate-900 border-b border-brand-100 pb-2 mb-3">Prescription Details</h4>
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                   {prescriptions[appt.id].medicineDetails}
                                </p>
                             </div>
                             {prescriptions[appt.id].notes && (
                               <div>
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Doctor's Notes</h4>
                                  <p className="text-xs text-slate-500 italic">
                                     "{prescriptions[appt.id].notes}"
                                  </p>
                               </div>
                             )}
                          </div>
                          <Button variant="primary" size="sm" icon={Download} className="h-fit">Print Rx</Button>
                       </div>
                    </div>
                  )}
                  {prescriptions[appt.id] === 'NOT_FOUND' && (
                    <div className="px-6 pb-6 text-xs font-medium text-slate-400 italic">No prescription available for this visit.</div>
                  )}
                </Card>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

// Missing import fix
import { ClipboardList } from 'lucide-react';
