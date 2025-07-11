
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, User, Settings, Hash, MessageCircle } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card fixed top-0 left-0 right-0 z-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
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

        {/* Right Sidebar - Trending & Suggestions */}
        <aside className="hidden lg:block w-80 fixed right-0 top-20 h-full p-4">
          <div className="space-y-4">
            {/* Trending Topics */}
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3 text-primary">{t('trendingTopics')}</h3>
              <div className="space-y-2">
                {['#QuantumComputing', '#ClimateScience', '#MachineLearning', '#Biotech'].map((tag) => (
                  <div key={tag} className="p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors">
                    <span className="text-sm font-medium text-primary">{tag}</span>
                    <p className="text-xs text-muted-foreground">12.5K {t('discussions')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3 text-primary">{t('suggestedScientists')}</h3>
              <div className="space-y-3">
                {[
                  { name: 'Dr. Sarah Chen', field: 'Quantum Physics', followers: '15.2K' },
                  { name: 'Prof. Alex Kumar', field: 'AI Research', followers: '8.7K' },
                  { name: 'Dr. Maya Rodriguez', field: 'Biotechnology', followers: '22.1K' }
                ].map((user) => (
                  <div key={user.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-400"></div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.field}</p>
                      </div>
                    </div>
                    <Button size="sm" className="glow-button">{t('follow')}</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

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
