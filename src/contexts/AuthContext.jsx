import { createContext, useContext, useState, useCallback } from 'react';
import LoginModal from '../components/LoginModal';

const AuthContext = createContext(null);

export function AuthProvider({ user, children }) {
  const [modalOpen, setModalOpen]         = useState(false);
  const [modalMessage, setModalMessage]   = useState('Sign in to continue');
  const [pendingCallback, setPendingCallback] = useState(null);

  // requireAuth(message, callback)
  // If user is logged in: runs callback immediately.
  // If not: opens LoginModal; callback runs after successful auth.
  const requireAuth = useCallback((message, callback) => {
    if (user) {
      if (callback) callback();
      return;
    }
    setModalMessage(message || 'Sign in to continue');
    setPendingCallback(() => callback || null);
    setModalOpen(true);
  }, [user]);

  const handleSuccess = useCallback(() => {
    setModalOpen(false);
    // pendingCallback is set as a function reference
    setPendingCallback(prev => {
      if (prev) prev();
      return null;
    });
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setPendingCallback(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, requireAuth }}>
      {children}
      <LoginModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        message={modalMessage}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
