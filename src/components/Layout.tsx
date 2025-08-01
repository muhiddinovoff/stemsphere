
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, MessageCircle, Search, User, Grid3X3, Home } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Search },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header for mobile and tablet/desktop */}
      <header className="bg-secondary py-4 px-6 border-b md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-bold">STEMSphere</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop/Tablet Header */}
      <header className="hidden md:block bg-secondary py-4 px-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-bold">STEMSphere</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t('settings')}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('signOut')}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar Navigation for Desktop/Tablet */}
        <aside className="hidden md:flex flex-col w-64 bg-secondary border-r">
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className="w-full justify-start flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-6 px-8 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t md:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center space-y-1 p-2 min-w-0 flex-1"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs truncate">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
