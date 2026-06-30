import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LyricShare - Learn Languages with Music',
  description: 'Share songs, learn languages, and create beautiful lyric videos',
  openGraph: {
    title: 'LyricShare',
    description: 'Learn Languages with Music',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}
