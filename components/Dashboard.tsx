
import React, { useState } from 'react';
import { Meeting } from '../types';
import MeetingCard from './MeetingCard';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

interface DashboardProps {
  meetings: Meeting[];
  onBook: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ meetings, onBook }) => {
  const user = getCurrentUser();
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'LIVE' | 'PAST'>('UPCOMING');
  
  // View & Pagination state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(user ? 'table' : 'grid');
  const [sliderIndex, setSliderIndex] = useState(0);
  const [explorerPage, setExplorerPage] = useState(0);
  
  const itemsPerSlider = 4;
  const itemsPerExplorerPage = 10;

  // Global filters
  const filteredMeetings = meetings.filter(m => 
    (m.status === activeTab) &&
    (m.title.toLowerCase().includes(filter.toLowerCase()) || 
     m.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())))
  );

  // Slider logic (Top 4 Featured)
  const upcomingMeetings = meetings.filter(m => m.status === 'UPCOMING');
  const visibleUpcoming = upcomingMeetings.slice(sliderIndex, sliderIndex + itemsPerSlider);

  // Explorer Pagination logic
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerExplorerPage);
  const paginatedMeetings = filteredMeetings.slice(
    explorerPage * itemsPerExplorerPage, 
    (explorerPage + 1) * itemsPerExplorerPage
  );

  const nextSlide = () => {
    if (sliderIndex + itemsPerSlider < upcomingMeetings.length) {
      setSliderIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - 1);
    }
  };

  const changeExplorerPage = (dir: number) => {
    const next = explorerPage + dir;
    if (next >= 0 && next < totalPages) {
      setExplorerPage(next);
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen flex flex-col scroll-smooth">
      {/* Landing / Welcome Section */}
      <section className="relative overflow-hidden pt-32 pb-24 px-8 bg-gradient-to-b from-emerald-900/10 to-zinc-950">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic uppercase mono">
            Welcome to <span className="text-emerald-500">Z3r0Day-Talks</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Elite collaborative platform for researchers to host technical meetups, broadcast zero-day research, and build the future of cybersecurity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user ? (
              <Link to="/auth" className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest text-sm">
                Join Network
              </Link>
            ) : (
              <Link to="/create" className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all uppercase tracking-widest text-sm">
                Host New Session
              </Link>
            )}
            <button 
              onClick={() => {
                const target = document.getElementById(user ? 'session-explorer' : 'upcoming-slider');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-widest text-sm"
            >
              View Research Sessions
            </button>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Slider */}
      <section id="upcoming-slider" className="max-w-7xl mx-auto w-full px-8 mb-20 scroll-mt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 uppercase italic mono tracking-tighter">>> Featured Upcoming Sessions</h2>
            <p className="text-zinc-500 text-sm">Top-rated research transmissions scheduled by the community.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={prevSlide}
              disabled={sliderIndex === 0}
              className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-emerald-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              onClick={nextSlide}
              disabled={sliderIndex + itemsPerSlider >= upcomingMeetings.length}
              className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-emerald-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {visibleUpcoming.map(meeting => (
            <div key={meeting.id} className="scale-95 hover:scale-100 transition-transform duration-300">
              <MeetingCard meeting={meeting} onBook={() => onBook(meeting.id)} />
            </div>
          ))}
        </div>
      </section>

      {/* Researcher Command Center - PAGINATED (Only Authenticated) */}
      {user && (
        <div id="session-explorer" className="max-w-7xl mx-auto w-full p-8 pt-16 border-t border-zinc-900 scroll-mt-24">
          <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-zinc-100 mb-2 uppercase tracking-tight">Researcher Command Center</h2>
              <p className="text-zinc-500">Comprehensive directory of all global research transmissions.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button onClick={() => setViewMode('grid')} className={`p-2 px-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-600'}`}>
                  <i className="fa-solid fa-grip"></i>
                </button>
                <button onClick={() => setViewMode('table')} className={`p-2 px-3 rounded-lg transition-all ${viewMode === 'table' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-600'}`}>
                  <i className="fa-solid fa-list"></i>
                </button>
              </div>
              <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
                {(['UPCOMING', 'LIVE', 'PAST'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => { setActiveTab(tab); setExplorerPage(0); }}
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-grow">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"></i>
              <input 
                type="text" 
                placeholder="Search repository by metadata..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-700"
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setExplorerPage(0); }}
              />
            </div>
          </div>

          {paginatedMeetings.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
              <h3 className="text-xl font-bold text-zinc-600 italic">No nodes detected on this frequency.</h3>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {paginatedMeetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} onBook={() => onBook(meeting.id)} />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    <th className="px-10 py-5">Transmission</th>
                    <th className="px-10 py-5">Source Node</th>
                    <th className="px-10 py-5">Temporal Data</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {paginatedMeetings.map(m => (
                    <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-10 py-6">
                        <p className="font-bold text-zinc-100 italic">{m.title}</p>
                        <div className="flex gap-2 mt-2">
                          {m.tags.slice(0, 3).map(t => <span key={t} className="text-[9px] text-zinc-600 uppercase font-mono border border-zinc-800 px-1.5 rounded">{t}</span>)}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <Link to={`/user/${m.host}`} className="text-emerald-500 font-bold hover:text-emerald-400 italic transition-colors">@{m.host}</Link>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-zinc-300 text-sm font-medium">{m.date}</p>
                        <p className="text-zinc-600 text-[10px] font-mono mt-1">{m.startTime} UTC</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          m.status === 'LIVE' ? 'border-rose-500 text-rose-500 bg-rose-500/10' :
                          m.status === 'PAST' ? 'border-zinc-700 text-zinc-500 bg-zinc-800/50' :
                          'border-emerald-500/30 text-emerald-500/50 bg-emerald-500/5'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Link to={`/meeting/${m.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                          <i className="fa-solid fa-terminal"></i> Enter
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Explorer Pagination Controls */}
              <div className="p-8 bg-zinc-950/50 border-t border-zinc-800 flex justify-between items-center">
                 <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                   Showing {explorerPage * itemsPerExplorerPage + 1} - {Math.min((explorerPage + 1) * itemsPerExplorerPage, filteredMeetings.length)} of {filteredMeetings.length} Transmissions
                 </p>
                 <div className="flex gap-3">
                   <button 
                    onClick={() => changeExplorerPage(-1)}
                    disabled={explorerPage === 0}
                    className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-500 disabled:opacity-20 text-[10px] font-bold rounded-xl transition-all uppercase tracking-widest"
                   >
                     Previous
                   </button>
                   <button 
                    onClick={() => changeExplorerPage(1)}
                    disabled={explorerPage + 1 >= totalPages}
                    className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-500 disabled:opacity-20 text-[10px] font-bold rounded-xl transition-all uppercase tracking-widest"
                   >
                     Next
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Why Section / Value Prop */}
      <section id="value-prop" className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-microchip text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white uppercase italic mono tracking-tighter">Technical Rigor</h3>
              <p className="text-zinc-500 leading-relaxed">
                Demonstrate live vulnerabilities in sandboxed environments. Z3r0Day-Talks is built for code, not just slide decks.
              </p>
            </div>
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-shield-virus text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white uppercase italic mono tracking-tighter">Secure Networking</h3>
              <p className="text-zinc-500 leading-relaxed">
                Connect with nodes across the globe. Our reputation system ensures you're learning from verified security professionals.
              </p>
            </div>
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/30 group-hover:bg-rose-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-satellite-dish text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white uppercase italic mono tracking-tighter">Rapid Research</h3>
              <p className="text-zinc-500 leading-relaxed">
                Vulnerabilities evolve daily. Our platform allows for instant knowledge transfer as new CVEs emerge in the wild.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-user-secret text-black text-xl"></i>
                </div>
                <span className="text-2xl font-bold tracking-tighter text-zinc-100 mono italic uppercase">Z3r0Day-Talks</span>
              </Link>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                The premier hub for technical security research. Secure. Open. High-Frequency.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-colors border border-zinc-800">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-colors border border-zinc-800">
                  <i className="fa-brands fa-discord"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-colors border border-zinc-800">
                  <i className="fa-brands fa-github"></i>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Navigation</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Sessions</Link></li>
                <li><Link to="/find" className="hover:text-emerald-500 transition-colors">Find Researchers</Link></li>
                <li><Link to="/auth" className="hover:text-emerald-500 transition-colors">Join Platform</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Security</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Matrix</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Compliance Log</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Link Update</h4>
              <p className="text-zinc-600 text-xs italic mb-4">Subscribe for research notifications.</p>
              <form className="relative">
                <input type="email" placeholder="Input Email..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm text-zinc-200" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em]">
                &copy; 2024 Z3r0Day-Talks // ROOT_LEVEL_RESEARCH
             </p>
             <div className="flex gap-8 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-zinc-400">Policy</a>
                <a href="#" className="hover:text-zinc-400">Contact</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
