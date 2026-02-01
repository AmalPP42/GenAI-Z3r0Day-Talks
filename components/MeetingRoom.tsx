
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Meeting, Message } from '../types';
import Whiteboard from './Whiteboard';
import { getCyberAdvice } from '../services/geminiService';
import { getCurrentUser } from '../services/authService';

interface MeetingRoomProps {
  meetings: Meeting[];
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ meetings }) => {
  const { id } = useParams<{ id: string }>();
  const meeting = meetings.find(m => m.id === id);
  const currentUser = getCurrentUser();

  const isHost = currentUser?.id === meeting?.hostId;

  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard' | 'screen'>('whiteboard');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'System', text: 'Secure session established. End-to-end encryption active.', timestamp: '10:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isCamOn, setIsCamOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  // Participants Mock
  const participants = [
    { name: meeting?.host || 'Researcher', role: 'Host', online: true },
    { name: 'NullPointer', role: 'Member', online: true },
    { name: 'RootAccess', role: 'Member', online: true },
    { name: 'CyberSentinel', role: 'Member', online: true },
  ];

  useEffect(() => {
    if (isCamOn && isHost) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Could not access camera", err));
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  }, [isCamOn, isHost]);

  const toggleScreenShare = async () => {
    if (!isHost) return;
    
    if (activeTab === 'screen') {
      setActiveTab('whiteboard');
      const stream = screenRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setActiveTab('screen');
      setTimeout(() => {
        if (screenRef.current) screenRef.current.srcObject = screenStream;
      }, 100);
      
      screenStream.getVideoTracks()[0].onended = () => {
        setActiveTab('whiteboard');
      };
    } catch (err) {
      console.error("Screen share error", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const prompt = inputText;
    setInputText('');

    if (prompt.toLowerCase().startsWith('/ai ')) {
      setAiThinking(true);
      try {
        const advice = await getCyberAdvice(prompt.replace('/ai ', ''));
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'Nexus AI',
          text: advice || 'I am sorry, I could not process that request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (err) {
        console.error(err);
      } finally {
        setAiThinking(false);
      }
    }
  };

  if (!meeting) {
    return <div className="p-20 text-center">Meeting not found. <Link to="/" className="text-emerald-500">Back to Dashboard</Link></div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-[#09090b]">
      {/* Sidebar - Participants & Stats */}
      <div className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col p-4">
        <div className="mb-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Participants</h2>
          <div className="space-y-3">
            {participants.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-zinc-400">{p.name.charAt(0)}</span>
                  </div>
                  {p.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full"></div>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{p.name}</p>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{p.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-zinc-900 space-y-4">
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Session Timer</p>
            <p className="text-xl font-mono text-emerald-500">00:42:15</p>
          </div>
          <button className="w-full bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 py-3 rounded-xl border border-rose-500/20 font-bold text-sm transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-power-off"></i>
            Disconnect
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-grow bg-zinc-900 flex flex-col relative">
        {/* Header */}
        <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div>
            <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-3 italic uppercase mono tracking-tighter">
              {meeting.title}
              <span className="px-3 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] rounded-full border border-emerald-500/20 animate-pulse">TRANSMISSION_LIVE</span>
            </h1>
          </div>
          
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button 
              onClick={() => setActiveTab('whiteboard')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'whiteboard' ? 'bg-zinc-800 text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Whiteboard
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'video' ? 'bg-zinc-800 text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Researcher Cam
            </button>
            {isHost && (
              <button 
                onClick={toggleScreenShare}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'screen' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {activeTab === 'screen' ? 'Stop Screen Share' : 'Screen Share'}
              </button>
            )}
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-grow p-6 flex flex-col">
          <div className="flex-grow relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-black">
            {activeTab === 'whiteboard' && <Whiteboard readOnly={!isHost} />}
            
            {activeTab === 'video' && (
              <div className="w-full h-full relative group">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted={isHost} 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                {!isHost && !videoRef.current?.srcObject && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                    <div className="text-center">
                       <i className="fa-solid fa-user-secret text-zinc-800 text-6xl mb-4"></i>
                       <p className="text-zinc-500 mono uppercase tracking-widest text-xs">Waiting for Host Transmission...</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center border-4 border-zinc-950 shadow-xl">
                       <i className="fa-solid fa-user-shield text-black text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{meeting.host}</h3>
                      <p className="text-xs text-emerald-500 font-mono font-bold tracking-widest">>> SIGNAL_STABLE</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'screen' && (
              <div className="w-full h-full bg-zinc-950">
                <video 
                  ref={screenRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-6 right-6 bg-rose-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse shadow-lg uppercase tracking-widest">
                  BROADCASTING_SCREEN
                </div>
              </div>
            )}
          </div>

          {/* Media Controls Bar */}
          <div className="mt-6 h-16 bg-zinc-950 border border-zinc-800 rounded-[1.5rem] px-6 flex items-center justify-between shadow-2xl">
            <div className="flex gap-4">
               {isHost && (
                 <>
                  <button 
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isMicOn ? 'bg-zinc-800 text-zinc-200' : 'bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.3)]'}`}
                  >
                    <i className={`fa-solid ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                  </button>
                  <button 
                    onClick={() => setIsCamOn(!isCamOn)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isCamOn ? 'bg-zinc-800 text-zinc-200' : 'bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.3)]'}`}
                  >
                    <i className={`fa-solid ${isCamOn ? 'fa-video' : 'fa-video-slash'}`}></i>
                  </button>
                 </>
               )}
               {!isHost && (
                 <div className="flex items-center gap-3 text-zinc-500 text-xs font-bold uppercase tracking-widest px-4 border-r border-zinc-800 mr-2">
                    <i className="fa-solid fa-headphones"></i>
                    Listening Mode
                 </div>
               )}
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl text-[10px] font-bold border border-zinc-800 transition-all flex items-center gap-2 uppercase tracking-widest">
                <i className="fa-solid fa-shield-halved"></i>
                Verify Link
              </button>
              {isHost && (
                <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold shadow-xl transition-all flex items-center gap-2 uppercase tracking-widest">
                  <i className="fa-solid fa-download"></i>
                  Capture Canvas
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-80 bg-zinc-950 border-l border-zinc-900 flex flex-col">
        <div className="h-16 border-b border-zinc-900 flex items-center px-6 justify-between bg-zinc-900/20">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Secure Comms</h2>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] text-emerald-500 font-bold uppercase">LOCKED</span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                 <span className={`text-[9px] font-black uppercase tracking-tighter ${msg.sender === 'System' ? 'text-zinc-600' : msg.sender === 'Nexus AI' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                  {msg.sender}
                </span>
                <span className="text-[9px] text-zinc-700 mono">{msg.timestamp}</span>
              </div>
              <div className={`max-w-[95%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'You' ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg' : 
                msg.sender === 'System' ? 'bg-zinc-900/50 text-zinc-500 border border-zinc-900 italic' :
                msg.sender === 'Nexus AI' ? 'bg-zinc-900 text-emerald-100 border border-emerald-500/20' :
                'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800 shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {aiThinking && (
            <div className="flex flex-col items-start animate-pulse">
               <span className="text-[9px] font-black uppercase text-emerald-500 mb-1">Nexus AI</span>
               <div className="p-3 rounded-2xl bg-zinc-900 text-zinc-600 border border-zinc-900 text-xs italic">
                 Calculating...
               </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text" 
              placeholder="Input payload..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-700"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-emerald-600 hover:text-emerald-400 transition-colors"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
          <div className="mt-4 flex justify-center gap-4 opacity-30">
             <i className="fa-solid fa-lock text-[8px] text-zinc-600"></i>
             <i className="fa-solid fa-shield text-[8px] text-zinc-600"></i>
             <i className="fa-solid fa-key text-[8px] text-zinc-600"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
