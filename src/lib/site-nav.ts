export interface SiteNavItem {
  label: string;
  href: string;
}

export const PRIMARY_NAV_ITEMS: SiteNavItem[] = [
  { label: 'OSAN GAMES', href: '/labs' },
  { label: 'Modules', href: '/visual-classes' },
  { label: 'Workshops', href: '/workshops' },
  { label: 'Contribute', href: '/join' },
  { label: 'Resume', href: '/resume' },
];

export function normalizePath(pathname: string): string {
  const path = pathname.replace(/\/+$/, '');
  return path || '/';
}

export function isNavItemCurrent(pathname: string, href: string): boolean {
  const currentPath = normalizePath(pathname);
  const navPath = normalizePath(href);

  if (navPath === '/') {
    return currentPath === '/';
  }

  return currentPath === navPath || currentPath.startsWith(`${navPath}/`);
}
