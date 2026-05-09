"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({
  href,
  className,
  children,
  matchPrefix = false,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  matchPrefix?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = matchPrefix
    ? pathname === href || pathname.startsWith(href.replace(/\/$/, "") + "/")
    : pathname === href;
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={className}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}
