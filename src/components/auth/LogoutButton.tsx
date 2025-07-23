'use client';

import { useAuth } from '@/hooks/useAuth';

const LogoutButton = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <button
      onClick={logout}
      className="text-sm text-red-600 hover:underline ml-4"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
