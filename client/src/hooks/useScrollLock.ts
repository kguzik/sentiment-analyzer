import { useEffect } from 'react';

/**
 * Hook that prevents body scrolling when a modal/overlay is open
 * @param isLocked - Boolean flag indicating whether scroll should be locked
 */
export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
};
