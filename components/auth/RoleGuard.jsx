"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function RoleGuard({ allowedRoles, children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      const userRole = user.role || 'CUSTOMER'; // Default if missing

      if (allowedRoles.includes(userRole)) {
        setIsAuthorized(true);
      } else {
        // Redirect unauthorized users to their respective dashboards
        if (userRole === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (userRole === 'OWNER') {
          router.push('/owner/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary-600 font-medium">Verifying access...</div>
      </div>
    );
  }

  return children;
}
