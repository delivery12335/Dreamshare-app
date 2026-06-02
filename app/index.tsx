import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spinner, YStack } from '@blinkdotnew/mobile-ui';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeen = await AsyncStorage.getItem('has_seen_onboarding');
      if (hasSeen === 'true') {
        setTarget('/(tabs)');
      } else {
        setTarget('/onboarding');
      }
    };
    checkOnboarding();
  }, []);

  if (!target) {
    return (
      <YStack flex={1} backgroundColor="$color1" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$color9" />
      </YStack>
    );
  }

  return <Redirect href={target as any} />;
}
