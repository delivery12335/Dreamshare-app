import React from 'react';
import { OnboardingCarousel, SizableText, Button, toast } from '@blinkdotnew/mobile-ui';
import { Sparkles, Moon, Mic, Activity, X } from '@blinkdotnew/mobile-ui';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('has_seen_onboarding', 'true');
      router.replace('/(tabs)');
      toast('Welcome to DreamShare!', { variant: 'success' });
    } catch (e) {
      router.replace('/(tabs)');
    }
  };

  return (
    <OnboardingCarousel
      variant="editorial"
      brand={<SizableText size="$6" fontWeight="800" color="$color9">DreamShare</SizableText>}
      onComplete={handleComplete}
      onSkip={handleComplete}
      steps={[
        {
          title: 'Capture Your Dreams',
          description: 'Record your night journeys with voice or text before they fade away.',
          hero: <Moon size={80} color="$color9" />,
          eyebrow: 'STEP 1',
          ctaLabel: 'Continue',
        },
        {
          title: 'AI Analysis',
          description: 'Let our AI identify characters, emotions, and hidden themes in your subconscious.',
          hero: <Sparkles size={80} color="$color9" />,
          eyebrow: 'STEP 2',
          ctaLabel: 'Tell Me More',
        },
        {
          title: 'Deep Insights',
          description: 'Track your emotional patterns and discover the meaning behind recurring symbols.',
          hero: <Activity size={80} color="$color9" />,
          eyebrow: 'STEP 3',
          ctaLabel: 'Get Started',
        },
      ]}
    />
  );
}
