import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // In a real Next.js app, this would contain <html> and <body> tags.
  // Here we wrap children to maintain context if needed, relying on index.html for base tags.
  return (
    <>
      {children}
    </>
  );
}