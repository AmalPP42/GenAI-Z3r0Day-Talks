
import React from 'react';
import { Link } from 'react-router-dom';
import { Meeting } from '../types';

interface MeetingCardProps {
  meeting: Meeting;
  onBook: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onBook }) => {
  const isFull = meeting.bookedSlots >= meeting.maxSlots;
  const percentage = (meeting.bookedSlots / meeting.maxSlots) * 100;

  const getStatusBadge = () => {
    switch (meeting.status) {
      case 'LIVE': return <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse uppercase tracking-widest">LIVE NOW</span>;
      case 'PAST': return <span className="bg-zinc-800 text-zinc-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">ARCHIVED</span>;
      default: return <span className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">SCHEDULED</span>;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 transition-all group flex flex-col shadow-xl">
      <div className="p-8 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-wrap gap-2">
            {meeting.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-zinc-700">
                {tag}
              </span>
            ))}
          </div>
          {getStatusBadge()}
        </div>

        <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-emerald-400 transition-colors leading-tight italic uppercase mono tracking-tighter">
          {meeting.title}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2 mb-8 leading-relaxed">
          {meeting.description}
        </p>

        <div className="flex items-center gap-4 mb-8 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <span className="text-xs font-bold text-emerald-400">{meeting.host.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-0.5 leading-none">Researcher Node</p>
            <p className="text-sm text-zinc-200 font-bold italic">@{meeting.host}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-zinc-600">Capacity Matrix</span>
            <span className={isFull ? 'text-rose-500' : 'text-emerald-500'}>
              {meeting.bookedSlots} / {meeting.maxSlots} Slots
            </span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${meeting.status === 'LIVE' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : isFull ? 'bg-rose-500' : 'bg-emerald-600'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 flex gap-3">
        {meeting.status === 'UPCOMING' && (
          <button 
            onClick={onBook}
            disabled={isFull}
            className={`flex-grow py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isFull ? 'bg-zinc-800 text-zinc-600' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}`}
          >
            {isFull ? 'Queue Full' : 'Book Session'}
          </button>
        )}
        <Link 
          to={`/meeting/${meeting.id}`}
          className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${meeting.status === 'LIVE' ? 'bg-zinc-900 border-emerald-500 text-emerald-500 flex-grow' : 'bg-zinc-900 border-zinc-800 text-zinc-400 flex-grow'}`}
        >
          <i className="fa-solid fa-terminal"></i>
          {meeting.status === 'PAST' ? 'Watch Archive' : 'Enter Room'}
        </Link>
      </div>
    </div>
  );
};

export default MeetingCard;
