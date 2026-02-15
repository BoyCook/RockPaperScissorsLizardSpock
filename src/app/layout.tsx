import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rock Paper Scissors Lizard Spock',
  description: 'Play Rock Paper Scissors Lizard Spock online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
