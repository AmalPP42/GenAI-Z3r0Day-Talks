
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateMeeting from './components/CreateMeeting';
import MeetingRoom from './components/MeetingRoom';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import FindUsers from './components/FindUsers';
import AdminPanel from './components/AdminPanel';
import PublicProfile from './components/PublicProfile';
import { Meeting, User } from './types';
import { getCurrentUser, logout, MOCK_BULK_MEETINGS } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('z3r0day_meetings');
    return saved ? JSON.parse(saved) : MOCK_BULK_MEETINGS;
  });

  useEffect(() => {
    localStorage.setItem('z3r0day_meetings', JSON.stringify(meetings));
  }, [meetings]);

  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
  };

  const bookSlot = (id: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === id && m.bookedSlots < m.maxSlots) {
        return { ...m, bookedSlots: m.bookedSlots + 1 };
      }
      return m;
    }));
  };

  const handleAuth = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#09090b]">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard meetings={meetings} onBook={bookSlot} />} />
            <Route 
              path="/create" 
              element={user ? <CreateMeeting onAdd={addMeeting} user={user} /> : <Navigate to="/auth" />} 
            />
            <Route path="/meeting/:id" element={<MeetingRoom meetings={meetings} />} />
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/" /> : <Auth onAuthComplete={handleAuth} />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} onUpdate={setUser} onLogout={handleLogout} /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/find" 
              element={<FindUsers />} 
            />
            <Route 
              path="/admin" 
              element={user?.role === 'ADMIN' ? <AdminPanel /> : <Navigate to="/" />} 
            />
            <Route 
              path="/user/:username" 
              element={<PublicProfile meetings={meetings} />} 
            />
          </Routes>
        </main>
        {/* Footer in Dashboard for better integration, otherwise can stay here. User asked for specific sections in footer. */}
      </div>
    </Router>
  );
};

export default App;
