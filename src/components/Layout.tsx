
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, User, Settings, Hash, MessageCircle, ArrowLeft, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: Search, label: t('explore'), path: '/explore' },
    { icon: Hash, label: t('categories'), path: '/categories' },
    { icon: MessageCircle, label: t('messages'), path: '/messages' },
    { icon: User, label: t('profile'), path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const canGoBack = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Always visible */}
      <header className="glass-card fixed top-0 left-0 right-0 z-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {canGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="glass-card border-0 mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              STEMSphere
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="glass-card border-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex max-w-6xl mx-auto pt-20">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-64 fixed left-0 top-20 h-full p-4">
          <nav className="glass-card p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 px-4">
          {children}
        </main>
      </div>

      {/* Footer with Edit Profile */}
      <footer className="glass-card border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © 2024 STEMSphere. All rights reserved.
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="glass-card fixed bottom-0 left-0 right-0 md:hidden border-t">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
