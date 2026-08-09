import type { ReactNode } from 'react';

interface ToolCanvasProps {
  children: ReactNode;
}

export function ToolCanvas({ children }: ToolCanvasProps) {
  return (
    <main
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
      aria-label="Tool content"
    >
      {children}
    </main>
  );
}
