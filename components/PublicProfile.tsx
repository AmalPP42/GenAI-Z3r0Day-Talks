
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Meeting } from '../types';
import { findUserByUsername } from '../services/authService';
import MeetingCard from './MeetingCard';

interface PublicProfileProps {
  meetings: Meeting[];
}

const PublicProfile: React.FC<PublicProfileProps> = ({ meetings }) => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'history' | 'research'>('sessions');

  useEffect(() => {
    if (username) {
      findUserByUsername(username).then(u => {
        if (u) setUser(u);
        setLoading(false);
      });
    }
  }, [username]);

  if (loading) return <div className="p-20 text-center text-zinc-500 mono flex flex-col items-center gap-4"><i className="fa-solid fa-circle-notch fa-spin text-3xl text-emerald-500"></i> SYNCHRONIZING_NODE_DATA...</div>;
  if (!user) return <div className="p-20 text-center text-zinc-500 uppercase font-bold tracking-widest">Node Not Found.</div>;

  const userMeetings = meetings.filter(m => m.hostId === user.id);
  const upcoming = userMeetings.filter(m => m.status === 'UPCOMING');
  const past = userMeetings.filter(m => m.status === 'PAST');
  const present = userMeetings.filter(m => m.status === 'LIVE');

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">
      <header className="mb-16 flex flex-col md:flex-row items-center md:items-end gap-10">
        <div className="relative group">
          <div className="w-48 h-48 rounded-[3rem] bg-zinc-900 border-[12px] border-zinc-900 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full border-4 border-zinc-900 shadow-xl uppercase tracking-widest">
            {user.role}
          </div>
        </div>
        
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mono mb-2">
            @{user.username}
          </h1>
          <p className="text-2xl text-zinc-400 font-medium">{user.realName} | <span className="text-emerald-500">{user.affiliation || 'Independent Node'}</span></p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
             <div className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-3">
                <i className="fa-solid fa-star text-emerald-500 text-sm"></i>
                <span className="text-sm font-bold text-zinc-300">Reputation: {user.reputation}</span>
             </div>
             <button className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl transition-all text-xs uppercase tracking-widest">
                Subscribe to Feed
             </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-10">
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">Technical Matrix</h3>
            <div className="flex flex-wrap gap-2">
              {user.expertise.map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-950 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-800 uppercase tracking-widest">
                  {skill}
                </span>
              ))}
            </div>
            
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-10 mb-6 border-b border-zinc-800 pb-2">Certifications</h3>
            <div className="space-y-3">
              {user.certifications.map(cert => (
                <div key={cert.id} className="flex items-center gap-3">
                  <i className="fa-solid fa-medal text-emerald-500 text-xs"></i>
                  <p className="text-xs font-bold text-zinc-300 uppercase tracking-tight">{cert.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-8">
             <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Channels</h3>
             <div className="flex gap-4">
                {user.github && <a href={`https://${user.github}`} className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-colors border border-zinc-800"><i className="fa-brands fa-github text-xl"></i></a>}
                {user.linkedin && <a href={`https://${user.linkedin}`} className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-colors border border-zinc-800"><i className="fa-brands fa-linkedin text-xl"></i></a>}
             </div>
          </section>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-3 space-y-12">
           <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-hide">
              {(['sessions', 'history', 'research'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'text-emerald-500 border-b-4 border-emerald-500' : 'text-zinc-600 hover:text-zinc-300'}`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <div className="animate-in fade-in slide-in-from-right-10 duration-500">
              {activeTab === 'sessions' && (
                <div className="space-y-12">
                  <section>
                    <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       Upcoming Signals
                    </h2>
                    {upcoming.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcoming.map(m => <MeetingCard key={m.id} meeting={m} onBook={() => {}} />)}
                      </div>
                    ) : <p className="text-zinc-700 italic">No future signals locked.</p>}
                  </section>
                </div>
              )}

              {activeTab === 'history' && (
                <section>
                  <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">Archived Transmissions</h2>
                  {past.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                      {past.map(m => <MeetingCard key={m.id} meeting={m} onBook={() => {}} />)}
                    </div>
                  ) : <p className="text-zinc-700 italic">History buffer is empty.</p>}
                </section>
              )}

              {activeTab === 'research' && (
                <div className="space-y-12">
                   <section>
                      <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-8">Intelligence Reports (Posts)</h2>
                      <div className="space-y-6">
                        {user.posts.map(post => (
                          <div key={post.id} className="p-8 bg-zinc-950 border border-zinc-900 rounded-[2rem] hover:border-emerald-500/30 transition-all">
                             <h4 className="text-2xl font-black text-zinc-100 uppercase italic tracking-tighter mono mb-4">{post.title}</h4>
                             <p className="text-zinc-500 mb-4 line-clamp-3">{post.content}</p>
                             <span className="text-[10px] text-emerald-500 font-mono font-bold uppercase">{post.date}</span>
                          </div>
                        ))}
                      </div>
                   </section>

                   <section>
                      <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-8">Data Payloads (Research Notes)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.researchNotes.map(note => (
                          <div key={note.id} className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:bg-zinc-900 transition-colors cursor-pointer group">
                             <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                               <i className="fa-solid fa-file-pdf text-rose-500"></i>
                             </div>
                             <div className="flex-grow">
                                <h5 className="text-sm font-bold text-zinc-300 group-hover:text-white">{note.title}</h5>
                                <p className="text-[10px] text-zinc-600 font-mono">{note.filename}</p>
                             </div>
                             <i className="fa-solid fa-download text-zinc-800 group-hover:text-emerald-500"></i>
                          </div>
                        ))}
                      </div>
                   </section>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
