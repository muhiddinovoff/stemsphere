
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, MessageCircle, Search, User, Grid3X3, Home, Menu, X } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import UserProfileModal from './UserProfileModal';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setProfileModalOpen(true);
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Search },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop/Tablet Sidebar */}
      <aside className={`hidden md:block fixed left-0 top-0 h-full nav-glass transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}>
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 animate-slide-in-right">
              <img 
                src="/placeholder.svg" 
                alt="STEMSphere Logo" 
                className="h-8 w-8 rounded-lg mirror-glass-strong p-1" 
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                STEMSphere
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="glass-button p-2"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.path} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
                  <button
                    onClick={() => navigate(item.path)}
                    className={`nav-item w-full ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="ml-3 text-sm font-medium transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-glass-border space-y-2">
          <NotificationDropdown />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className={`nav-item w-full justify-start`}
          >
            <Settings className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-3 text-sm">Settings</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="nav-item w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`md:ml-0 transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-70'
      }`} style={{
        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 
          ? (sidebarCollapsed ? '80px' : '280px') 
          : '0'
      }}>
        {/* Mobile Header */}
        <header className="md:hidden mirror-glass-strong p-4 border-b border-glass-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/placeholder.svg" 
                alt="STEMSphere Logo" 
                className="h-8 w-8 rounded-lg mirror-glass-strong p-1" 
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                STEMSphere
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationDropdown />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="glass-button p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 pb-20 md:pb-6">
          {React.cloneElement(children as React.ReactElement, { onUserClick: handleUserClick })}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-glass-bg-strong'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Profile Modal */}
      <UserProfileModal
        userId={selectedUserId}
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setSelectedUserId(null);
        }}
        onMessage={(userId) => {
          setProfileModalOpen(false);
          navigate('/messages', { state: { userId } });
        }}
      />
    </div>
  );
};

export default Layout;
