
export type UserRole = 'NORMAL' | 'PREMIUM' | 'MANAGER' | 'ADMIN';
export type Gender = 'None' | 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface ResearchNote {
  id: string;
  title: string;
  filename: string;
  date: string;
  fileUrl?: string;
}

export interface User {
  id: string;
  username: string; // Unique Display Name
  realName: string; // Real name
  email: string;
  phoneNumber: string;
  affiliation: string; 
  jobTitle?: string;
  companyName?: string;
  gender: Gender;
  role: UserRole;
  expertise: string[];
  bio: string;
  avatar?: string;
  banner?: string;
  linkedin?: string;
  github?: string;
  medium?: string;
  reputation: number;
  meetingCount: number;
  totalMeetingDuration: number; 
  avgRating: number;
  followersCount: number;
  followingCount: number;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  posts: Post[];
  researchNotes: ResearchNote[];
  privacySettings: {
    showPhone: boolean;
    showSocials: boolean;
    showBio: boolean;
    showExpertise: boolean;
    showExperience: boolean;
    showEducation: boolean;
  };
}

export type MeetingStatus = 'UPCOMING' | 'LIVE' | 'PAST';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  host: string;
  hostId: string;
  date: string;
  startTime: string;
  maxSlots: number;
  bookedSlots: number;
  tags: string[];
  status: MeetingStatus;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export type AuthMode = 'login' | 'signup' | 'otp-verify' | 'forgot-password';
