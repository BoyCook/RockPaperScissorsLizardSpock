'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '🎮 Play' },
  { href: '/play/local', label: '👥 Local Game' },
  { href: '/rules', label: '📖 Rules' },
  { href: '/about', label: 'ℹ️ About' },
];

interface NavBarProps {
  variant?: 'light' | 'dark';
}

export default function NavBar({ variant = 'light' }: NavBarProps) {
  const pathname = usePathname();
  const className = variant === 'dark' ? 'nav-bar nav-bar-dark' : 'nav-bar';

  return (
    <nav className={className} data-testid="nav-bar">
      {navItems
        .filter((item) => item.href !== pathname)
        .map((item) => (
          <Link key={item.href} href={item.href} className="nav-link">
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
