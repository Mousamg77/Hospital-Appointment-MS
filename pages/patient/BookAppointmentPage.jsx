import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, bookAppointment } from '../../api/api';
import { Card, Button, Badge } from '../../components/common/UI';
import { Calendar, Clock, Stethoscope, ChevronLeft, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({ appointmentDate: '', timeSlot: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getDoctorById(doctorId).then(res => setDoctor(res.data.data));
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bookAppointment({ doctorId, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/history'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return (
    <div className="flex items-center justify-center h-80">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold transition-colors">
        <ChevronLeft size={20} />
        Back to Doctors
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Doctor Info Card */}
        <div className="space-y-6">
           <Card className="text-center pt-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-20 bg-brand-500"></div>
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-lg mx-auto mb-6">
                    <div className="w-full h-full bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-3xl">
                       {doctor.name.charAt(0)}
                    </div>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 font-display">Dr. {doctor.name}</h2>
                 <Badge variant="blue">{doctor.specialization}</Badge>
                 
                 <div className="mt-8 space-y-4 text-left border-t border-slate-50 pt-6">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                       <MapPin size={18} className="text-brand-500" />
                       <span className="font-medium">St. Mary Hospital, Clinic B</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                       <Stethoscope size={18} className="text-brand-500" />
                       <span className="font-medium">{doctor.experienceYears}+ Years Experience</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                       <Calendar size={18} className="text-brand-500" />
                       <span className="font-medium">Available: {doctor.availableDays || 'Mon - Fri'}</span>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="bg-brand-50 border-brand-100 italic text-sm text-brand-700">
              "Providing the best healthcare services with compassion and advanced technology."
           </Card>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-2">
           <Card className="h-full">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                     <CheckCircle2 size={64} />
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-2xl font-bold text-slate-900">Appointment Requested!</h2>
                     <p className="text-slate-500">Your appointment with Dr. {doctor.name} has been sent for approval. You will be redirected shortly.</p>
                  </div>
                  <Button variant="success" onClick={() => navigate('/history')}>Go to My History</Button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 font-display">Book Appointment</h3>
                    <p className="text-slate-500">Fill in the details below to schedule your visit.</p>
                  </div>

                  {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium flex items-center gap-3">
                       <AlertCircle size={20} />
                       {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Preferred Date</label>
                          <div className="relative group">
                             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                             <input
                               type="date" required min={today}
                               value={form.appointmentDate}
                               onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-slate-700"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Time Slot</label>
                          <div className="relative group">
                             <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                             <select
                               required
                               value={form.timeSlot}
                               onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-slate-700 appearance-none"
                             >
                               <option value="">Select Time</option>
                               {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Reason for Visit</label>
                       <textarea
                         rows={4} required
                         placeholder="How can we help you? Briefly describe your symptoms..."
                         value={form.reason}
                         onChange={(e) => setForm({ ...form, reason: e.target.value })}
                         className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-slate-700 resize-none"
                       />
                    </div>

                    <Button type="submit" loading={loading} className="w-full py-4 text-base" icon={CheckCircle2}>
                       Confirm & Request Appointment
                    </Button>
                  </form>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}
