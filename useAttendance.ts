import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Member } from '../types';
import { useMembers } from './useMembers';

export const useAttendance = () => {
  const { addMember, members } = useMembers();

  const checkAndSubmitAttendance = async (
    name: string,
    session: { code: string; name: string; day: string; time: string }
  ) => {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. 회원 찾기 또는 생성
    let member = members.find(m => m.name === name);
    let memberId = member?.id;

    if (!member) {
      // 신규 회원 자동 등록
      const newMemberRef = await addDoc(collection(db, 'members'), {
        name,
        phone: '',
        createdAt: new Date().toISOString()
      });
      memberId = newMemberRef.id;
    }

    // 2. 중복 출석 확인
    const q = query(
      collection(db, 'logs'),
      where('memberId', '==', memberId),
      where('date', '==', today),
      where('sessionCode', '==', session.code)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('이미 오늘 이 수업에 출석하셨습니다.');
    }

    // 3. 출석 로그 저장
    const logData = {
      memberId,
      memberName: name,
      date: today,
      sessionCode: session.code,
      sessionName: session.name,
      day: session.day,
      time: session.time,
      timestamp: serverTimestamp()
    };

    await addDoc(collection(db, 'logs'), logData);
    return { isNewMember: !member };
  };

  return { checkAndSubmitAttendance };
};