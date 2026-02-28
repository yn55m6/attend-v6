export interface Member {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Log {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  sessionCode: string;
  sessionName: string;
  timestamp: any; // Firestore Timestamp
  day: string;
  time: string;
}