
import React from 'react';
import { User } from '../types';

interface UserProfileViewProps {
  user: User;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ user }) => {
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-500">
      
      {/* Banner */}
      <div className="h-64 relative overflow-hidden">
        <img 
          src={user.banner || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'} 
          className="w-full h-full object-cover brightness-50" 
          alt="Banner" 
        />
        <div className="absolute top-6 right-8 flex gap-3">
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <i className="fa-solid fa-star text-emerald-400 text-xs"></i>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">Rep: {user.reputation}</span>
           </div>
           <button className="bg-emerald-600 border border-emerald-500 px-6 py-2 rounded-2xl text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg">
              Follow Node
           </button>
        </div>
      </div>

      <div className="px-10 pb-10">
        <div className="flex flex-col md:flex-row items-end -mt-16 mb-8 gap-6">
          <div className="w-32 h-32 rounded-[2rem] bg-zinc-900 border-8 border-zinc-900 overflow-hidden shadow-2xl">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              {user.realName}
              <span className="text-emerald-500 text-sm font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">@{user.username}</span>
            </h1>
            <p className="text-zinc-400 mt-1 font-medium text-lg">{user.jobTitle || 'Researcher'} at <span className="text-emerald-400">{user.companyName || user.affiliation}</span></p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Followers', val: user.followersCount, icon: 'fa-users' },
            { label: 'Following', val: user.followingCount, icon: 'fa-user-plus' },
            { label: 'Hosted Sessions', val: user.meetingCount, icon: 'fa-microphone' },
            { label: 'Total Duration', val: formatDuration(user.totalMeetingDuration), icon: 'fa-clock' }
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center justify-center group hover:border-emerald-500/30 transition-all">
              <i className={`fa-solid ${stat.icon} text-zinc-600 group-hover:text-emerald-500 transition-colors mb-2 text-xs`}></i>
              <span className="text-xl font-bold text-zinc-100">{stat.val}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           <div className="md:col-span-2 space-y-8">
              {user.privacySettings.showBio && (
                <section>
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Transmission Bio</h3>
                   <p className="text-zinc-400 text-base leading-relaxed">{user.bio || 'Researcher node active. No data transmission available.'}</p>
                </section>
              )}
              {user.privacySettings.showExpertise && (
                <section>
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Technical Expertise</h3>
                   <div className="flex flex-wrap gap-2">
                      {user.expertise.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-zinc-950 text-zinc-300 text-xs font-bold rounded-xl border border-zinc-800">
                          {skill}
                        </span>
                      ))}
                   </div>
                </section>
              )}
              {user.privacySettings.showExperience && user.experiences.length > 0 && (
                <section>
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Past Experience</h3>
                   <div className="space-y-4">
                      {user.experiences.map(exp => (
                        <div key={exp.id} className="p-5 bg-zinc-950/50 border border-zinc-800 rounded-3xl">
                           <h4 className="text-sm font-bold text-white mb-1">{exp.position}</h4>
                           <p className="text-emerald-500 text-xs font-bold mb-2">{exp.company}</p>
                           <p className="text-zinc-500 text-xs">{exp.duration}</p>
                        </div>
                      ))}
                   </div>
                </section>
              )}
           </div>
           
           <div className="space-y-8">
              {user.privacySettings.showSocials && (
                <section>
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Researcher Channels</h3>
                   <div className="flex gap-4">
                      {user.github && (
                        <a href={`https://${user.github}`} target="_blank" className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-all shadow-md">
                          <i className="fa-brands fa-github text-lg"></i>
                        </a>
                      )}
                      {user.linkedin && (
                        <a href={`https://${user.linkedin}`} target="_blank" className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-all shadow-md">
                          <i className="fa-brands fa-linkedin text-lg"></i>
                        </a>
                      )}
                      {user.medium && (
                        <a href={`https://${user.medium}`} target="_blank" className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-all shadow-md">
                          <i className="fa-brands fa-medium text-lg"></i>
                        </a>
                      )}
                   </div>
                </section>
              )}
              <section className="p-6 bg-zinc-950 border border-zinc-800 rounded-[2rem]">
                 <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Session Stats</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-zinc-500">Avg Session Rating</span>
                       <span className="text-sm font-bold text-emerald-500">{user.avgRating || 'N/A'} <i className="fa-solid fa-star text-[10px]"></i></span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-zinc-500">Active Since</span>
                       <span className="text-sm font-bold text-zinc-300">2023</span>
                    </div>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
