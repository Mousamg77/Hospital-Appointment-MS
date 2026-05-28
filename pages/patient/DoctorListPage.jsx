import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../../api/api';
import { Card, Button, Badge } from '../../components/common/UI';
import { Search, MapPin, Star, Calendar, ArrowRight, Filter } from 'lucide-react';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors().then(res => setDoctors(res.data.data)).finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Specialized Doctors</h1>
          <p className="text-slate-500 mt-1">Book an appointment with our world-class medical experts.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm"
            />
          </div>
          <Button variant="secondary" icon={Filter} className="hidden md:flex">Filters</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No doctors found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          <Button variant="ghost" onClick={() => setSearch('')} className="mt-4 text-brand-600">Clear Search</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(doc => (
            <Card key={doc.id} className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full border-slate-50 overflow-hidden" noPadding>
              <div className="bg-brand-500 h-24 relative">
                <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-2xl p-1 shadow-lg">
                  <div className="w-full h-full bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 font-bold text-xl">
                    {doc.name.charAt(0)}
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                   <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> 4.9
                   </div>
                </div>
              </div>
              
              <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Dr. {doc.name}</h3>
                  <p className="text-sm font-semibold text-brand-500 uppercase tracking-wide">{doc.specialization}</p>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                       <MapPin size={16} />
                    </div>
                    <span>St. Mary Hospital, NY</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                       <Calendar size={16} />
                    </div>
                    <span>{doc.availableDays || 'Mon - Fri'}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                    <p className="text-sm font-bold text-slate-700">{doc.experienceYears}+ Years</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/book/${doc.id}`)}
                    className="bg-brand-50 group-hover:bg-brand-500 text-brand-600 group-hover:text-white transition-all duration-300"
                  >
                    Details <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
