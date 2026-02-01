'use client';

import { useEffect } from 'react';

export function StudioHashCleaner() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const clearStudioHash = () => {
      if (window.location.hash !== '#studio') {
        return;
      }
      const { pathname, search } = window.location;
      window.history.replaceState(null, '', `${pathname}${search}`);
    };

    clearStudioHash();

    const handleHashChange = () => {
      clearStudioHash();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return null;
}
