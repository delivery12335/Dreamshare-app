import React from 'react';
import { LoginScreen, toast } from '@blinkdotnew/mobile-ui';
import { blink } from '@/lib/blink';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();

  const handleLogin = async (email: string, pass: string) => {
    try {
      await blink.auth.signInWithEmail(email, pass);
      router.replace('/(tabs)');
      toast('Welcome back!', { variant: 'success' });
    } catch (error: any) {
      toast('Login failed', { message: error.message, variant: 'error' });
    }
  };

  const handleProviderLogin = async (id: string) => {
    try {
      if (id === 'google') await blink.auth.signInWithGoogle();
      if (id === 'apple') await blink.auth.signInWithApple();
      router.replace('/(tabs)');
    } catch (error: any) {
      toast('Social login failed', { variant: 'error' });
    }
  };

  return (
    <LoginScreen
      variant="editorial"
      title="DreamShare"
      subtitle="Unlock the secrets of your subconscious"
      logo={<H1 size="$8" fontWeight="800" color="$color9">🌙</H1>}
      providers={[
        { id: 'google', name: 'Continue with Google', brand: 'google' },
        { id: 'apple', name: 'Continue with Apple', brand: 'apple' },
      ]}
      onProviderPress={handleProviderLogin}
      showEmailForm
      onEmailSubmit={handleLogin}
      onTerms={() => {}}
      onPrivacy={() => {}}
    />
  );
}

import { H1 } from '@blinkdotnew/mobile-ui';
