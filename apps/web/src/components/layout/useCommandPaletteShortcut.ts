import { useEffect } from 'react';

import { usePaletteStore } from '@/store/palette';

export function useCommandPaletteShortcut(): void {
  const setOpen = usePaletteStore((state) => state.setOpen);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);
}
