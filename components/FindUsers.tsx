
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { searchUsers } from '../services/authService';
import UserProfileView from './UserProfileView';

const FindUsers: React.FC = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchUsers(query);
      setUsers(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedUser) {
    return (
      <div className="max-w-6xl mx-auto p-8 relative">
        <button 
          onClick={() => setSelectedUser(null)}
          className="absolute top-8 left-0 -translate-x-full w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-all mr-8"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <UserProfileView user={selectedUser} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-zinc-100 mb-3 tracking-tight">Researcher Directory</h1>
        <p className="text-zinc-500">Search for unique handles to connect with leading security analysts.</p>
      </header>

      <div className="relative mb-12">
        <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500"></i>
        <input 
          type="text" 
          placeholder="Enter @handle or real name..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] py-5 pl-14 pr-6 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500"><i className="fa-solid fa-spinner fa-spin"></i></div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-6 hover:border-emerald-500/50 transition-all group flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-[1.2rem] bg-zinc-800 border-2 border-zinc-800 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="Avatar" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100 leading-tight">{user.realName}</h3>
                <p className="text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-tighter">@{user.username}</p>
              </div>
            </div>
            
            <p className="text-zinc-400 text-xs line-clamp-2 mb-6 flex-grow">{user.bio || 'Researcher node active. No data transmission available.'}</p>
            
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-grow">
                <p className="text-sm font-bold text-zinc-200">{user.reputation}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Reputation</p>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-zinc-200">{user.followersCount}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Followers</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedUser(user)}
              className="w-full py-3 bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all border border-zinc-700 hover:border-emerald-500"
            >
              Access Profile
            </button>
          </div>
        ))}

        {!loading && query && users.length === 0 && (
           <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-900">
                <i className="fa-solid fa-radar text-zinc-700 text-xl"></i>
              </div>
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No researcher nodes found on this frequency.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default FindUsers;
