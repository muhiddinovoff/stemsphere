
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationCode = async (email: string, userId: string) => {
    setLoading(true);
    try {
      const code = generateCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

      const { error: insertError } = await supabase
        .from('email_verification_codes')
        .insert({
          user_id: userId,
          email,
          code,
          expires_at: expiresAt.toISOString()
        });

      if (insertError) throw insertError;

      // In a real app, you'd send this via email service
      // For demo purposes, we'll show it in a toast
      toast({
        title: "Verification Code",
        description: `Your verification code is: ${code}`,
        duration: 10000
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Code",
          description: "The verification code is invalid or expired",
          variant: "destructive"
        });
        return { success: false };
      }

      // Mark as verified
      await supabase
        .from('email_verification_codes')
        .update({ verified: true })
        .eq('id', data.id);

      toast({
        title: "Success",
        description: "Email verified successfully!"
      });

      return { success: true };
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    loading
  };
};
