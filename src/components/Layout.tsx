
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary py-4 px-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-bold">STEMSphere</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
            <LanguageSelector />
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
      <main className="py-6 px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
