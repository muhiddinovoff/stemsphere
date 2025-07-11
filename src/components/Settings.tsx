
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LanguageSelector from './LanguageSelector';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { signOut, user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle>{t('settings')}</CardTitle>
          </div>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">{t('language')}</h3>
            <LanguageSelector />
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3">Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Signed in as: {user?.email}
            </p>
            <Button 
              onClick={signOut} 
              variant="destructive" 
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('signOut')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
