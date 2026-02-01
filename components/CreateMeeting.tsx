
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSessionIdeas } from '../services/geminiService';
import { Meeting, User } from '../types';

interface CreateMeetingProps {
  onAdd: (meeting: Meeting) => void;
  user: User;
}

const CreateMeeting: React.FC<CreateMeetingProps> = ({ onAdd, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    maxSlots: 12,
    topic: '',
    tags: ''
  });

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setLoading(true);
    try {
      const result = await generateSessionIdeas(formData.topic);
      setFormData(prev => ({
        ...prev,
        title: result.title,
        description: result.description,
        tags: result.tags.join(', ')
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation for past date
    const selectedDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const now = new Date();
    
    if (selectedDateTime <= now) {
      setError("Cannot schedule meetings in the past. Time travel module not detected.");
      return;
    }

    const newMeeting: Meeting = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      // Fix: Changed user.name to user.realName as per User interface definition
      host: user.realName,
      hostId: user.id,
      date: formData.date,
      startTime: formData.startTime,
      maxSlots: formData.maxSlots,
      bookedSlots: 1,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      // Fix: Added missing status property as per Meeting interface
      status: 'UPCOMING'
    };
    onAdd(newMeeting);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Host a Research Session</h1>
        {/* Fix: Changed user.name to user.realName as per User interface definition */}
        <p className="text-zinc-400">Hosting as <span className="text-emerald-500 font-semibold">{user.realName}</span>.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-bold flex items-center gap-3">
          <i className="fa-solid fa-clock-rotate-left"></i>
          {error}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="mb-10 pb-10 border-b border-zinc-800">
          <label className="block text-sm font-medium text-emerald-500 mb-2 uppercase tracking-widest">AI Assisted Draft</label>
          <div className="flex gap-2">
            <input type="text" placeholder="Enter a topic (e.g. Docker Security)" className="flex-grow bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} />
            <button type="button" disabled={loading} onClick={handleGenerate} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold rounded-xl border border-zinc-700 transition-all flex items-center gap-2">
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
              Draft
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Session Title</label>
              <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Date</label>
              <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Start Time</label>
              <input required type="time" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="md:col-span-2">
               <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Detailed Description</label>
               <textarea required rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all">
            Initialize Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;
