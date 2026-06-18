'use client';

import { useEffect } from 'react';

/**
 * This component clears the dashboard PIN session when mounted.
 * Place it on the landing page so that whenever a user visits the landing page,
 * their dashboard will require PIN verification again on next visit.
 */
export default function ClearPinSession() {
  useEffect(() => {
    sessionStorage.removeItem('pinUnlocked');
    sessionStorage.removeItem('lastActiveTime');
  }, []);

  return null;
}
