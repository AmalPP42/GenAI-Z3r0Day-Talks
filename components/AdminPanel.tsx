
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { getAllUsers, adminUpdateUser, adminDeleteUser, adminCreateUser, getUserActivities, getCurrentUser } from '../services/authService';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  
  // Detail State
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    try {
      if (editingUser.id) {
        await adminUpdateUser(editingUser.id, editingUser);
      } else {
        await adminCreateUser(editingUser);
      }
      loadUsers();
      setIsEditorOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Confirm deletion of node? This action is irreversible.")) {
      await adminDeleteUser(userId);
      loadUsers();
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'MANAGER': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'PREMIUM': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-all">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-zinc-100 mb-2 mono uppercase tracking-tighter italic">>> ADMIN_COMMAND_CENTER</h1>
            <p className="text-zinc-500 text-xs mono">Managing Researcher Node Access and Privileges</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { setEditingUser({ role: 'NORMAL' }); setIsEditorOpen(true); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> New Researcher
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Nodes', val: users.length, icon: 'fa-server' },
          { label: 'Admins', val: users.filter(u => u.role === 'ADMIN').length, icon: 'fa-user-shield' },
          { label: 'Active Meetings', val: 12, icon: 'fa-microphone' },
          { label: 'Security Alerts', val: 0, icon: 'fa-shield-virus', color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 ${stat.color || ''}`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{stat.val}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Node User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Clearance</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Activity Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Direct Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-zinc-600 mono">SYNCHRONIZING_DATABASE...</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden shadow-sm">
                        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/user/${user.username}`} className="text-sm font-bold text-emerald-500 hover:text-emerald-400 italic transition-colors">@{user.username}</Link>
                        <p className="text-[10px] text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                       <span className="text-xs text-zinc-400">Stable Link</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => setInspectingUser(user)}
                      className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-widest"
                      title="Inspect Activities"
                    >
                      <i className="fa-solid fa-radar mr-1"></i> Logs
                    </button>
                    <button 
                      onClick={() => { setEditingUser(user); setIsEditorOpen(true); }}
                      className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-widest"
                      title="Edit Node"
                    >
                      <i className="fa-solid fa-user-pen mr-1"></i> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length === 1}
                      className="text-zinc-500 hover:text-rose-500 transition-colors text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                      title="Decommission Node"
                    >
                      <i className="fa-solid fa-trash mr-1"></i> Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <header className="p-8 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-zinc-100 mono uppercase italic">
                {editingUser?.id ? `>> UPDATE_NODE: ${editingUser.username}` : '>> CREATE_NEW_NODE'}
              </h2>
              <button onClick={() => setIsEditorOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </header>
            <form onSubmit={handleSaveUser} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Display Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200" 
                    value={editingUser?.username || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Real Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200" 
                    value={editingUser?.realName || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, realName: e.target.value })} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Email Node</label>
                <input 
                  required 
                  type="email" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200" 
                  value={editingUser?.email || ''} 
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Clearance Role</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200"
                  value={editingUser?.role || 'NORMAL'}
                  disabled={editingUser?.role === 'ADMIN'} // Rule: Cannot change Admin role
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {editingUser?.role === 'ADMIN' && <p className="text-[9px] text-rose-500 mt-1 uppercase mono italic font-bold">Admin role protected.</p>}
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all mono uppercase tracking-widest text-xs">
                  EXECUTE_CHANGES
                </button>
                <button type="button" onClick={() => setIsEditorOpen(false)} className="px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3.5 rounded-2xl border border-zinc-700">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Inspect Modal / Activity Log */}
      {inspectingUser && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <header className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/30">
              <div className="flex items-center gap-4">
                <img src={inspectingUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${inspectingUser.username}`} className="w-12 h-12 rounded-2xl border-2 border-emerald-500/30" />
                <div>
                  <h2 className="text-xl font-bold text-white mono uppercase">@{inspectingUser.username}</h2>
                  <p className="text-xs text-zinc-500 mono">Activity Hash ID: {inspectingUser.id}</p>
                </div>
              </div>
              <button onClick={() => setInspectingUser(null)} className="text-zinc-500 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </header>
            
            <div className="p-8 h-[50vh] overflow-y-auto">
               <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <i className="fa-solid fa-clock-rotate-left"></i> Transmission Logs
               </h3>
               
               <div className="space-y-6 relative border-l border-zinc-800 pl-6 ml-2">
                  {getUserActivities(inspectingUser.id).map((activity) => (
                    <div key={activity.id} className="relative">
                       <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-900 shadow-[0_0_5px_rgba(16,185,129,0.3)]"></div>
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-zinc-300 uppercase mono">{activity.type}</span>
                          <span className="text-[10px] font-mono text-zinc-600">{activity.timestamp}</span>
                       </div>
                       <p className="text-sm text-zinc-500 leading-relaxed italic">{activity.description}</p>
                    </div>
                  ))}
               </div>
            </div>

            <footer className="p-8 border-t border-zinc-800 bg-zinc-950/30 flex justify-end">
               <button onClick={() => setInspectingUser(null)} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl border border-zinc-700 text-xs uppercase tracking-widest transition-all">
                  Close Log
               </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
