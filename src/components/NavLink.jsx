'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ to, className, children, onClick, ...props }) {
  const pathname = usePathname();
  const isActive = pathname === to || (to !== '/' && pathname?.startsWith(to));
  const classes = typeof className === 'function' ? className({ isActive }) : className;
  return (
    <Link href={to} className={classes} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
