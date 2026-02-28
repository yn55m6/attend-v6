import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Member } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'members'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Member[];
      setMembers(memberData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addMember = async (name: string, phone: string) => {
    await addDoc(collection(db, 'members'), {
      name,
      phone,
      createdAt: new Date().toISOString()
    });
  };

  const deleteMember = async (memberId: string) => {
    // 보호 로직: 출석 이력이 있는지 확인
    const logsQuery = query(
      collection(db, 'logs'), 
      where('memberId', '==', memberId), 
      limit(1)
    );
    const logsSnapshot = await getDocs(logsQuery);
    
    if (!logsSnapshot.empty) {
      throw new Error('출석 이력이 있는 회원은 삭제할 수 없습니다.');
    }
    await deleteDoc(doc(db, 'members', memberId));
  };

  return { members, loading, addMember, deleteMember };
};