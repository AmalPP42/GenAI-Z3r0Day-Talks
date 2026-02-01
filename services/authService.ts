
import { User, UserRole, Gender, Meeting, MeetingStatus } from '../types';
import { CONFIG } from '../config';

const generateMockMeetings = (): Meeting[] => {
  const meetings: Meeting[] = [];
  const researchers = ['GhostRoot', 'CipherSmith', 'KernelPanic', 'ShadowByte', 'ZeroSum'];
  const topics = ['Buffer Overflow', 'Cloud Security', 'Kubernetes Hacking', 'Zero Trust', 'Web3 Vulnerabilities', 'Hardware Hacking', 'Ransomware Triage', 'Malware Analysis', 'Forensics', 'IoT Exploits'];
  const tags = ['Binary', 'Exploit Dev', 'Cloud', 'Network', 'Mobile', 'Crypto', 'Red Team', 'Blue Team'];

  // 10 Live Meetings
  for (let i = 0; i < 10; i++) {
    meetings.push({
      id: `live-${i}`,
      title: `LIVE: ${topics[i % topics.length]} Advanced session`,
      description: `Analyzing live traffic and identifying anomalous patterns in real-time. Join the war room.`,
      host: researchers[i % researchers.length],
      hostId: `u${(i % 5) + 1}`,
      date: new Date().toISOString().split('T')[0],
      startTime: 'NOW',
      maxSlots: 15,
      bookedSlots: 12,
      tags: [tags[i % tags.length], 'LIVE'],
      status: 'LIVE'
    });
  }

  // 55 Upcoming Meetings
  for (let i = 0; i < 55; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (i + 1));
    meetings.push({
      id: `upcoming-${i}`,
      title: `${topics[i % topics.length]} - Deep Dive v${i}`,
      description: `Comprehensive research into the latest CVEs affecting ${topics[i % topics.length]} environments. Practical demos included.`,
      host: researchers[i % researchers.length],
      hostId: `u${(i % 5) + 1}`,
      date: futureDate.toISOString().split('T')[0],
      startTime: `${10 + (i % 8)}:00`,
      maxSlots: 15,
      bookedSlots: Math.floor(Math.random() * 10),
      tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
      status: 'UPCOMING'
    });
  }

  // 60 Past Meetings
  for (let i = 0; i < 60; i++) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - (i + 1));
    meetings.push({
      id: `past-${i}`,
      title: `ARCHIVE: ${topics[i % topics.length]} Case Study`,
      description: `A look back at how we mitigated the major breaches of last year related to ${topics[i % topics.length]}.`,
      host: researchers[i % researchers.length],
      hostId: `u${(i % 5) + 1}`,
      date: pastDate.toISOString().split('T')[0],
      startTime: 'COMPLETED',
      maxSlots: 15,
      bookedSlots: 15,
      tags: [tags[i % tags.length], 'ARCHIVE'],
      status: 'PAST'
    });
  }

  return meetings;
};

export const MOCK_BULK_MEETINGS = generateMockMeetings();

export const MOCK_USERS: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    realName: 'System Administrator',
    email: 'admin@z3r0day.io',
    phoneNumber: '+1 000-0000',
    affiliation: 'Core Command',
    gender: 'None',
    role: 'ADMIN',
    expertise: ['System Management', 'Access Control'],
    bio: 'Root level access. System-wide management node.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    reputation: 9999,
    meetingCount: 0,
    totalMeetingDuration: 0,
    avgRating: 5.0,
    followersCount: 0,
    followingCount: 0,
    experiences: [],
    education: [],
    certifications: [],
    posts: [],
    researchNotes: [],
    privacySettings: { showPhone: true, showSocials: true, showBio: true, showExpertise: true, showExperience: true, showEducation: true }
  },
  {
    id: 'u1',
    username: 'GhostRoot',
    realName: 'Alex Rivers',
    email: 'ghost@z3r0day.io',
    phoneNumber: '+1 555-0101',
    affiliation: 'ZeroDay Labs',
    gender: 'Male',
    role: 'PREMIUM',
    expertise: ['Web Security', 'Binary Analysis'],
    bio: 'Core developer and security enthusiast. Specialized in kernel-level exploitation and sandbox escapes.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost',
    reputation: 1250,
    meetingCount: 24,
    totalMeetingDuration: 1440,
    avgRating: 4.9,
    followersCount: 156,
    followingCount: 42,
    experiences: [
      { id: 'exp1', company: 'Palo Alto Networks', position: 'Security Researcher', duration: '2020 - Present', description: 'Working on zero-day research.' }
    ],
    education: [
      { id: 'edu1', school: 'MIT', degree: 'Computer Science', year: '2019' }
    ],
    certifications: [
      { id: 'cert1', name: 'OSCP', issuer: 'OffSec', year: '2021' }
    ],
    posts: [
      { id: 'p1', title: 'Why I love C', content: 'Low level is the best level.', date: '2024-05-10' }
    ],
    researchNotes: [
      { id: 'rn1', title: 'Buffer Overflows in 2024', filename: 'research_overflow.pdf', date: '2024-05-12' }
    ],
    privacySettings: { showPhone: false, showSocials: true, showBio: true, showExpertise: true, showExperience: true, showEducation: true }
  }
];

let runtimeUsers: User[] = JSON.parse(localStorage.getItem('z3r0day_users_db') || JSON.stringify(MOCK_USERS));

const persistUsers = () => {
  localStorage.setItem('z3r0day_users_db', JSON.stringify(runtimeUsers));
};

export const login = async (identifier: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  if (identifier === CONFIG.DEFAULT_ADMIN.username && password === CONFIG.DEFAULT_ADMIN.passwordHash) {
    const adminUser = runtimeUsers.find(u => u.username === 'admin') || MOCK_USERS[0];
    localStorage.setItem('z3r0day_user', JSON.stringify(adminUser));
    return adminUser;
  }
  const user = runtimeUsers.find(u => u.username === identifier || u.email === identifier);
  if (user) {
    localStorage.setItem('z3r0day_user', JSON.stringify(user));
    return user;
  }
  throw new Error("Invalid credentials or node not found.");
};

export const register = async (userData: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    username: userData.username || 'anon_node',
    realName: userData.realName || 'Anonymous Researcher',
    email: userData.email || '',
    phoneNumber: userData.phoneNumber || '',
    affiliation: userData.affiliation || 'Independent',
    gender: 'None',
    role: 'NORMAL',
    expertise: [],
    bio: '',
    reputation: 100,
    meetingCount: 0,
    totalMeetingDuration: 0,
    avgRating: 0,
    followersCount: 0,
    followingCount: 0,
    experiences: [],
    education: [],
    certifications: [],
    posts: [],
    researchNotes: [],
    privacySettings: { showPhone: false, showSocials: true, showBio: true, showExpertise: true, showExperience: true, showEducation: true }
  };
  runtimeUsers.push(newUser);
  persistUsers();
  localStorage.setItem('z3r0day_user', JSON.stringify(newUser));
  return newUser;
};

export const logout = () => localStorage.removeItem('z3r0day_user');

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem('z3r0day_user');
  return data ? JSON.parse(data) : null;
};

export const getAllUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return runtimeUsers;
};

export const adminCreateUser = async (userData: Partial<User>): Promise<User> => {
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    username: userData.username || '',
    realName: userData.realName || '',
    email: userData.email || '',
    phoneNumber: userData.phoneNumber || '',
    affiliation: userData.affiliation || '',
    gender: 'None',
    role: userData.role || 'NORMAL',
    expertise: [],
    bio: userData.bio || '',
    reputation: 100,
    meetingCount: 0,
    totalMeetingDuration: 0,
    avgRating: 0,
    followersCount: 0,
    followingCount: 0,
    experiences: [],
    education: [],
    certifications: [],
    posts: [],
    researchNotes: [],
    privacySettings: { showPhone: true, showSocials: true, showBio: true, showExpertise: true, showExperience: true, showEducation: true }
  };
  runtimeUsers.push(newUser);
  persistUsers();
  return newUser;
};

export const adminUpdateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  runtimeUsers = runtimeUsers.map(u => u.id === userId ? { ...u, ...updates } : u);
  persistUsers();
  return runtimeUsers.find(u => u.id === userId)!;
};

export const adminDeleteUser = async (userId: string): Promise<void> => {
  runtimeUsers = runtimeUsers.filter(u => u.id !== userId);
  persistUsers();
};

export const searchUsers = async (query: string): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return runtimeUsers.filter(u => 
    u.username.toLowerCase().includes(query.toLowerCase()) || 
    u.realName.toLowerCase().includes(query.toLowerCase())
  );
};

export const findUserByUsername = async (username: string): Promise<User | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return runtimeUsers.find(u => u.username === username);
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const current = getCurrentUser();
  if (!current) throw new Error("Not logged in");
  const updated = { ...current, ...userData };
  runtimeUsers = runtimeUsers.map(u => u.id === current.id ? updated : u);
  persistUsers();
  localStorage.setItem('z3r0day_user', JSON.stringify(updated));
  return updated;
};

export const getUserActivities = (userId: string) => {
  return [
    { id: 'a1', type: 'LOGIN', description: 'Session initialized via remote node', timestamp: '2024-05-18 09:42:00' },
    { id: 'a2', type: 'MEETING_HOSTED', description: 'Hosted "Advanced Buffer Overflow"', timestamp: '2024-05-17 14:00:00' },
    { id: 'a3', type: 'PROFILE_UPDATE', description: 'Bio encryption keys updated', timestamp: '2024-05-16 11:20:00' },
    { id: 'a4', type: 'FOLLOW', description: 'Started following @CipherSmith', timestamp: '2024-05-15 23:10:00' }
  ];
};

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePasswordStrength = (password: string) => password.length >= 8;
export const changePassword = async (oldPass: string, newPass: string): Promise<void> => { await new Promise(r => setTimeout(r, 800)); };
export const sendOTP = async (email: string): Promise<void> => { await new Promise(r => setTimeout(r, 800)); };
