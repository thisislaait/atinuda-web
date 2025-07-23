'use client';

import {useAuth} from "@/hooks/useAuth";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth();

  if (!user) return null; // Or show a loader
  return <>{children}</>;
};

export default AuthWrapper;
