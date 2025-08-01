
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, MessageCircle, Search, User, Grid3X3, Home, Menu, X } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import UserProfileModal from './UserProfileModal';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleProfileClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Search },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Desktop & Tablet Header */}
      <header className="hidden md:block glass-card mx-4 mt-4 mb-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="glass-button lg:hidden hover:bg-white/10 text-white border border-white/20"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/3cb36f43-0a14-424d-a18d-1d5ef0afd5e2.png" 
                alt="STEMSphere Logo" 
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                STEMSphere
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="glass-button flex items-center space-x-2 hover:bg-white/10 text-white border border-white/20"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">{t('settings')}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="glass-button flex items-center space-x-2 hover:bg-white/10 text-white border border-white/20"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">{t('signOut')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="block md:hidden glass-card mx-4 mt-4 mb-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/3cb36f43-0a14-424d-a18d-1d5ef0afd5e2.png" 
              alt="STEMSphere Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              STEMSphere
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="glass-button hover:bg-white/10 text-white border border-white/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col glass-nav mx-4 mb-4 rounded-xl transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}>
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="glass-button w-full justify-center hover:bg-white/10 text-white border border-white/20"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          <nav className="flex-1 px-3">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className={`glass-nav-item w-full hover:bg-white/10 text-white border border-white/20 ${
                        active ? 'bg-white/20 border-white/30' : ''
                      } ${
                        sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center px-2 py-3'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Tablet Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={toggleSidebar}>
            <aside className="fixed left-0 top-0 h-full w-64 glass-nav sidebar-enter z-50 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="p-4 border-b border-white/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="glass-button w-full justify-end hover:bg-white/10 text-white border border-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex-1 px-3 py-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <li key={item.path}>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            navigate(item.path);
                            setSidebarOpen(false);
                          }}
                          className={`glass-nav-item w-full justify-start px-4 py-3 hover:bg-white/10 text-white border border-white/20 ${
                            active ? 'bg-white/20 border-white/30' : ''
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        )}

        {/* Tablet Icon-only Sidebar */}
        <aside className="hidden md:flex lg:hidden flex-col glass-nav mx-4 mb-4 rounded-xl w-16 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="glass-button w-full justify-center hover:bg-white/10 text-white border border-white/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 px-3">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className={`glass-nav-item w-full justify-center px-2 py-3 hover:bg-white/10 text-white border border-white/20 ${
                        active ? 'bg-white/20 border-white/30' : ''
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 py-4 pb-20 md:pb-6 custom-scrollbar">
          {React.cloneElement(children as React.ReactElement, { onProfileClick: handleProfileClick })}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t md:hidden z-50 mobile-nav-enter border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-around items-center py-3 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`glass-nav-item flex flex-col items-center space-y-1 p-2 min-w-0 flex-1 hover:bg-white/10 text-white ${
                  active ? 'bg-white/20' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs truncate">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      <UserProfileModal
        userId={selectedUserId}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUserId(null);
        }}
        onMessage={(userId) => {
          console.log('Message user:', userId);
        }}
      />
    </div>
  );
};

export default Layout;
