
import React, { useState, useRef } from 'react';
import { User, Experience, Education, Certification, Post, ResearchNote, Gender } from '../types';
import { updateProfile } from '../services/authService';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'certifications' | 'posts' | 'notes'>('about');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<User>(user);

  const pfpInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfile(formData);
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addDynamicItem = (type: 'experiences' | 'education' | 'certifications') => {
    const newItem: any = { id: Math.random().toString(36).substr(2, 9) };
    if (type === 'experiences') {
      newItem.company = ''; newItem.position = ''; newItem.duration = ''; newItem.description = '';
    } else if (type === 'education') {
      newItem.school = ''; newItem.degree = ''; newItem.year = '';
    } else {
      newItem.name = ''; newItem.issuer = ''; newItem.year = '';
    }
    setFormData({ ...formData, [type]: [...(formData[type] || []), newItem] });
  };

  const removeDynamicItem = (type: 'experiences' | 'education' | 'certifications', id: string) => {
    setFormData({ ...formData, [type]: formData[type].filter((item: any) => item.id !== id) });
  };

  const handleImageChange = (type: 'avatar' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
        
        {/* Banner Section */}
        <div className="h-80 relative group overflow-hidden">
          <img 
            src={formData.banner || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'} 
            className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" 
            alt="Banner" 
          />
          {isEditing && (
            <button 
              onClick={() => bannerInput.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-xs font-bold border border-white/30 uppercase tracking-widest">
                Update Tactical Banner
              </div>
              <input ref={bannerInput} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange('banner', e)} />
            </button>
          )}
          
          <div className="absolute top-8 right-8 flex gap-3">
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-2xl flex items-center gap-3">
                <i className="fa-solid fa-bolt text-emerald-400"></i>
                <span className="text-sm font-mono font-bold text-white uppercase tracking-widest">Rep: {user.reputation}</span>
             </div>
             <button onClick={onLogout} className="bg-rose-500/20 backdrop-blur-xl border border-rose-500/30 px-6 py-2.5 rounded-2xl text-rose-500 text-xs font-bold uppercase tracking-widest hover:bg-rose-500/30 transition-all">
                Terminate Link
             </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-end -mt-20 mb-12 gap-6">
            <div className="flex flex-col md:flex-row items-end gap-8 w-full md:w-auto">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] bg-zinc-900 border-[10px] border-zinc-900 overflow-hidden shadow-2xl">
                  <img src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="Avatar" />
                </div>
                {isEditing && (
                  <button 
                    onClick={() => pfpInput.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fa-solid fa-camera text-white text-2xl"></i>
                    <input ref={pfpInput} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange('avatar', e)} />
                  </button>
                )}
              </div>
              <div className="flex-grow pb-2">
                <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
                  {user.realName}
                  <span className="text-emerald-500 text-base font-mono font-bold bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">@{user.username}</span>
                </h1>
                <p className="text-zinc-400 mt-2 font-medium text-xl">
                  {user.jobTitle || 'Security Analyst'} at <span className="text-emerald-400">{user.companyName || user.affiliation || 'Independent'}</span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex-grow md:flex-none px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${isEditing ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}
              >
                {isEditing ? 'Discard Changes' : 'Modify Access Profile'}
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-12 animate-in slide-in-from-bottom-6 duration-300">
               {/* IDENTITY SEC */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em] border-b border-emerald-500/20 pb-3 flex items-center gap-3">
                        <i className="fa-solid fa-id-card"></i> Identity Matrix
                     </h3>
                     <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Real Identity Name</label>
                        <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-200" value={formData.realName} onChange={(e) => setFormData({...formData, realName: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Gender</label>
                           <select className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-200" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}>
                              <option value="None">None</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Job Title</label>
                           <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-200" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
                        </div>
                     </div>
                  </div>

                  {/* EXPERTISE SEC */}
                  <div className="space-y-6">
                     <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em] border-b border-emerald-500/20 pb-3 flex items-center gap-3">
                        <i className="fa-solid fa-layer-group"></i> Expertise Array
                     </h3>
                     <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Core Bio Transmission</label>
                        <textarea rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-200" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                     </div>
                  </div>
               </div>

               {/* DYNAMIC LISTS: EXPERIENCES, EDUCATION, CERTIFICATIONS */}
               <div className="space-y-12">
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Past Field Experiences</h3>
                      <button type="button" onClick={() => addDynamicItem('experiences')} className="text-emerald-500 text-xs font-bold uppercase hover:text-emerald-400">+ Add Position</button>
                    </div>
                    <div className="space-y-4">
                      {formData.experiences.map((exp, idx) => (
                        <div key={exp.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4 relative">
                          <button type="button" onClick={() => removeDynamicItem('experiences', exp.id)} className="absolute top-4 right-4 text-zinc-700 hover:text-rose-500"><i className="fa-solid fa-trash"></i></button>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Company" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={exp.company} onChange={(e) => {
                              const newExp = [...formData.experiences]; newExp[idx].company = e.target.value; setFormData({...formData, experiences: newExp});
                            }} />
                            <input type="text" placeholder="Position" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={exp.position} onChange={(e) => {
                              const newExp = [...formData.experiences]; newExp[idx].position = e.target.value; setFormData({...formData, experiences: newExp});
                            }} />
                          </div>
                          <input type="text" placeholder="Duration (e.g. 2021 - Present)" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={exp.duration} onChange={(e) => {
                            const newExp = [...formData.experiences]; newExp[idx].duration = e.target.value; setFormData({...formData, experiences: newExp});
                          }} />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Academic History</h3>
                      <button type="button" onClick={() => addDynamicItem('education')} className="text-emerald-500 text-xs font-bold uppercase hover:text-emerald-400">+ Add Education</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.education.map((edu, idx) => (
                        <div key={edu.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3 relative">
                           <button type="button" onClick={() => removeDynamicItem('education', edu.id)} className="absolute top-4 right-4 text-zinc-700 hover:text-rose-500"><i className="fa-solid fa-trash"></i></button>
                           <input type="text" placeholder="School/University" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={edu.school} onChange={(e) => {
                              const newEdu = [...formData.education]; newEdu[idx].school = e.target.value; setFormData({...formData, education: newEdu});
                           }} />
                           <div className="grid grid-cols-2 gap-2">
                             <input type="text" placeholder="Degree" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={edu.degree} onChange={(e) => {
                                const newEdu = [...formData.education]; newEdu[idx].degree = e.target.value; setFormData({...formData, education: newEdu});
                             }} />
                             <input type="text" placeholder="Year" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={edu.year} onChange={(e) => {
                                const newEdu = [...formData.education]; newEdu[idx].year = e.target.value; setFormData({...formData, education: newEdu});
                             }} />
                           </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tactical Certifications</h3>
                      <button type="button" onClick={() => addDynamicItem('certifications')} className="text-emerald-500 text-xs font-bold uppercase hover:text-emerald-400">+ Add Certification</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {formData.certifications.map((cert, idx) => (
                        <div key={cert.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3 relative">
                           <button type="button" onClick={() => removeDynamicItem('certifications', cert.id)} className="absolute top-4 right-4 text-zinc-700 hover:text-rose-500"><i className="fa-solid fa-trash"></i></button>
                           <input type="text" placeholder="Certification Name" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={cert.name} onChange={(e) => {
                              const newCert = [...formData.certifications]; newCert[idx].name = e.target.value; setFormData({...formData, certifications: newCert});
                           }} />
                           <input type="text" placeholder="Issuer" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm" value={cert.issuer} onChange={(e) => {
                              const newCert = [...formData.certifications]; newCert[idx].issuer = e.target.value; setFormData({...formData, certifications: newCert});
                           }} />
                        </div>
                      ))}
                    </div>
                  </section>
               </div>

               <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 rounded-[2rem] text-sm uppercase tracking-widest shadow-2xl transition-all">
                  {loading ? 'SYNCHRONIZING...' : 'UPDATE NODE IN NETWORK'}
               </button>
            </form>
          ) : (
            <div className="space-y-12">
               {/* View Tabs */}
               <div className="flex border-b border-zinc-800 mb-10 overflow-x-auto scrollbar-hide">
                  {['about', 'experience', 'education', 'certifications', 'posts', 'notes'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-8 py-5 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {tab}
                    </button>
                  ))}
               </div>

               <div className="animate-in fade-in slide-in-from-left-6 duration-500">
                  {activeTab === 'about' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                       <div className="md:col-span-2 space-y-10">
                          <section>
                             <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Researcher Narrative</h3>
                             <p className="text-zinc-400 text-lg leading-relaxed font-medium italic">"{user.bio || 'Node active. Transmission awaiting initialization.'}"</p>
                          </section>
                          <section>
                             <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6 border-b border-zinc-900 pb-2">Technical Matrix</h3>
                             <div className="flex flex-wrap gap-3">
                                {user.expertise.length > 0 ? user.expertise.map(skill => (
                                  <span key={skill} className="px-5 py-2.5 bg-emerald-500/5 text-emerald-500 text-xs font-bold rounded-xl border border-emerald-500/10">
                                    {skill}
                                  </span>
                                )) : <p className="text-zinc-700 text-sm italic">No expertise declared.</p>}
                             </div>
                          </section>
                       </div>
                       <div className="space-y-10">
                          <section>
                             <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Command Channels</h3>
                             <div className="grid grid-cols-1 gap-4">
                                {user.linkedin && (
                                  <a href={`https://${user.linkedin}`} target="_blank" className="flex items-center gap-4 p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-emerald-500/30 group transition-all">
                                    <i className="fa-brands fa-linkedin text-zinc-600 group-hover:text-emerald-500 text-xl"></i>
                                    <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-100 uppercase tracking-widest">LinkedIn Node</span>
                                  </a>
                                )}
                                {user.github && (
                                  <a href={`https://${user.github}`} target="_blank" className="flex items-center gap-4 p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-emerald-500/30 group transition-all">
                                    <i className="fa-brands fa-github text-zinc-600 group-hover:text-emerald-500 text-xl"></i>
                                    <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-100 uppercase tracking-widest">GitHub Core</span>
                                  </a>
                                )}
                             </div>
                          </section>
                       </div>
                    </div>
                  )}

                  {activeTab === 'experience' && (
                    <div className="space-y-8">
                       {user.experiences.length > 0 ? user.experiences.map((exp) => (
                         <div key={exp.id} className="p-8 bg-zinc-950 rounded-[2rem] border border-zinc-800/50 relative overflow-hidden group">
                            <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500/20 group-hover:bg-emerald-500 transition-all"></div>
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                 <h4 className="text-2xl font-bold text-white uppercase italic mono tracking-tighter">{exp.position}</h4>
                                 <p className="text-emerald-500 font-bold text-lg">{exp.company}</p>
                               </div>
                               <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">{exp.duration}</span>
                            </div>
                            <p className="text-zinc-500 text-base leading-relaxed">{exp.description || 'Classified research and development operations.'}</p>
                         </div>
                       )) : (
                         <p className="text-zinc-700 italic py-10 text-center">No field experience recorded.</p>
                       )}
                    </div>
                  )}

                  {activeTab === 'education' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {user.education.length > 0 ? user.education.map((edu) => (
                         <div key={edu.id} className="p-8 bg-zinc-950/50 rounded-[2.5rem] border border-zinc-800/50 flex items-center gap-8 group hover:border-emerald-500/30 transition-all">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                               <i className="fa-solid fa-graduation-cap text-emerald-500 text-2xl"></i>
                            </div>
                            <div>
                               <h4 className="text-xl font-bold text-white italic uppercase mono tracking-tighter">{edu.degree}</h4>
                               <p className="text-zinc-400 text-sm font-medium">{edu.school}</p>
                               <p className="text-[10px] text-zinc-600 font-black mt-2 uppercase tracking-widest">Class of {edu.year}</p>
                            </div>
                         </div>
                       )) : (
                         <p className="col-span-2 text-zinc-700 italic py-10 text-center">No academic history recorded.</p>
                       )}
                    </div>
                  )}

                  {activeTab === 'certifications' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {user.certifications.length > 0 ? user.certifications.map((cert) => (
                         <div key={cert.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition-all">
                            <div className="w-12 h-12 mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                               <i className="fa-solid fa-certificate text-emerald-500 text-xl"></i>
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-1">{cert.name}</h4>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{cert.issuer}</p>
                            <p className="text-[10px] text-emerald-600 font-mono mt-2">ID: {cert.id.slice(0, 5)}</p>
                         </div>
                       )) : (
                         <p className="col-span-3 text-zinc-700 italic py-10 text-center">No tactical certifications found.</p>
                       )}
                    </div>
                  )}

                  {activeTab === 'posts' && (
                    <div className="space-y-8">
                       {user.posts.length > 0 ? user.posts.map((post) => (
                         <article key={post.id} className="p-10 bg-zinc-950 rounded-[3rem] border border-zinc-800 hover:border-emerald-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                               <h4 className="text-3xl font-black text-zinc-100 uppercase italic mono tracking-tighter group-hover:text-emerald-500 transition-colors">{post.title}</h4>
                               <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase">{post.date}</span>
                            </div>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-6">{post.content}</p>
                            <button className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                               Read Intelligence Report <i className="fa-solid fa-arrow-right"></i>
                            </button>
                         </article>
                       )) : (
                         <div className="text-center py-20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
                            <i className="fa-solid fa-pen-nib text-zinc-800 text-4xl mb-4"></i>
                            <p className="text-zinc-700 italic">This node has not published any transmissions.</p>
                         </div>
                       )}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {user.researchNotes.length > 0 ? user.researchNotes.map((note) => (
                         <div key={note.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center gap-6 group hover:border-rose-500/30 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                               <i className="fa-solid fa-file-pdf text-rose-500 text-2xl"></i>
                            </div>
                            <div className="flex-grow">
                               <h4 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors">{note.title}</h4>
                               <p className="text-[10px] text-zinc-600 font-mono mt-1 uppercase">{note.filename} • {note.date}</p>
                            </div>
                            <i className="fa-solid fa-download text-zinc-700 group-hover:text-emerald-500"></i>
                         </div>
                       )) : (
                         <div className="col-span-2 text-center py-20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
                            <i className="fa-solid fa-file-code text-zinc-800 text-4xl mb-4"></i>
                            <p className="text-zinc-700 italic">No research notes archived.</p>
                         </div>
                       )}
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
