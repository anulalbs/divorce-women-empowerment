import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Props:
// - children: React node to render when allowed
// - allowedRoles?: array of strings, e.g. ['admin','expert']
// - redirectTo?: path to redirect when not allowed (defaults to '/signin')
export default function ProtectedRoute({ children, allowedRoles, redirectTo = '/signin' }) {
  const { profile, isLoggedIn } = useSelector((s) => s.user || {});

  if (!isLoggedIn || !profile) {
    // not authenticated
    return <Navigate to={redirectTo} replace />;
  }

  // if allowedRoles not provided, any authenticated user is allowed
  if (!allowedRoles || allowedRoles.length === 0) return children;

  const role = profile.role || profile?.role;
  if (allowedRoles.includes(role)) return children;

  // authenticated but not authorized
  return <Navigate to="/unauthorized" replace />;
}
