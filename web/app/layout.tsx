import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RecipeOS',
  description: 'A culinary toolkit for chefs and home cooks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
