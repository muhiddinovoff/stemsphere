
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { Shield, Mail } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  userId: string;
  onVerified: () => void;
}

const EmailVerification = ({ email, userId, onVerified }: EmailVerificationProps) => {
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const { sendVerificationCode, verifyCode, loading } = useEmailVerification();

  const handleSendCode = async () => {
    const result = await sendVerificationCode(email, userId);
    if (result.success) {
      setCodeSent(true);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) return;
    
    const result = await verifyCode(email, code);
    if (result.success) {
      onVerified();
    }
  };

  return (
    <Card className="w-full max-w-md glass-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center">
            <Shield className="text-white h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
        <CardDescription>
          {codeSent 
            ? `We've sent a 6-digit code to ${email}`
            : `Verify your email address to complete registration`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!codeSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                disabled
                className="glass-card"
              />
            </div>
            <Button 
              onClick={handleSendCode} 
              disabled={loading}
              className="w-full glow-button"
            >
              <Mail className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enter 6-digit code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <Button 
              onClick={handleVerifyCode} 
              disabled={loading || code.length !== 6}
              className="w-full glow-button"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleSendCode} 
              disabled={loading}
              className="w-full"
            >
              Resend Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
