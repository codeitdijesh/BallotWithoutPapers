import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Vote, BarChart3, User, Settings, Plus, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const voterNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Active Votes', href: '/votes', icon: Vote },
  { label: 'Results', href: '/results', icon: BarChart3 },
  { label: 'Profile', href: '/profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Create', href: '/admin/create', icon: Plus },
  { label: 'Manage', href: '/admin/manage', icon: List },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface NavigationProps {
  isAdmin?: boolean;
}

export function Navigation({ isAdmin = false }: NavigationProps) {
  const location = useLocation();
  const items = isAdmin ? adminNavItems : voterNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="container mx-auto flex h-16 items-center justify-around md:justify-center md:gap-8">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors md:flex-row md:gap-2 md:text-sm',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
