'use client';  // This is important for client-side components


import SmartMirror from '../components/SmartMirror';

export default function Home() {
  return (
    <main className="min-h-screen">
      <SmartMirror />
    </main>
  );
}
