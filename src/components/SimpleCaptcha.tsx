
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const SimpleCaptcha = ({ onVerify }: SimpleCaptchaProps) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (userInput.length === 6) {
      const isValid = userInput.toUpperCase() === captchaText;
      onVerify(isValid);
    } else {
      onVerify(false);
    }
  }, [userInput, captchaText]);

  return (
    <div className="space-y-2">
      <Label>Captcha Verification</Label>
      <div className="flex items-center space-x-2">
        <div className="flex-1 p-3 bg-muted rounded-md font-mono text-lg tracking-widest text-center select-none">
          {captchaText}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateCaptcha}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.toUpperCase())}
        placeholder="Enter the captcha code"
        maxLength={6}
        className="glass-card"
      />
    </div>
  );
};

export default SimpleCaptcha;
