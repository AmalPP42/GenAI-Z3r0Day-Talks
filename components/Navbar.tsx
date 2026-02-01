
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isSubPage = location.pathname !== '/' && location.pathname !== '/find' && location.pathname !== '/admin';

  return (
    <nav className="h-16 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isSubPage && (
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-all sm:mr-2"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
          </button>
        )}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-[0.8rem] flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
            <i className="fa-solid fa-user-secret text-black text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tighter text-zinc-100 mono italic hidden sm:block">Z3r0Day-Talks</span>
        </Link>
      </div>
      
      <div className="flex gap-8 items-center">
        <div className="hidden md:flex gap-6 items-center">
          <Link 
            to="/" 
            className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-emerald-400 ${location.pathname === '/' ? 'text-emerald-500' : 'text-zinc-500'}`}
          >
            Terminal
          </Link>
          <Link 
            to="/find" 
            className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-emerald-400 ${location.pathname === '/find' ? 'text-emerald-500' : 'text-zinc-500'}`}
          >
            Find Nodes
          </Link>
          {user?.role === 'ADMIN' && (
            <Link 
              to="/admin" 
              className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-rose-400 ${location.pathname === '/admin' ? 'text-rose-500' : 'text-zinc-500'}`}
            >
              Control Center
            </Link>
          )}
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link 
              to="/create" 
              className="hidden sm:flex bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              Init Session
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 pl-4 border-l border-zinc-800 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="Avatar" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase leading-none mb-0.5 mono">@{user.username}</p>
                  <p className="text-xs text-zinc-300 font-semibold">{user.realName}</p>
                </div>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400">
                    <i className="fa-solid fa-id-badge w-4"></i> Researcher Profile
                  </Link>
                  <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400">
                    <i className="fa-solid fa-shield-halved w-4"></i> Security Settings
                  </Link>
                  <div className="h-px bg-zinc-800 my-2"></div>
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 text-left"
                  >
                    <i className="fa-solid fa-power-off w-4"></i> Terminate Link
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link 
            to="/auth" 
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-bold uppercase tracking-widest border border-zinc-700 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
