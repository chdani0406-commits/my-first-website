import { useState, useEffect } from 'react';

/**
 * 로그인 상태 관리 훅
 * localStorage에 사용자 정보를 저장하여 세션 유지
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aplantgrowing_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (user) => {
    localStorage.setItem('aplantgrowing_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('aplantgrowing_user');
    setCurrentUser(null);
  };

  return { currentUser, login, logout };
}
