import React from 'react';
import { YStack, XStack, H1, H4, Paragraph, Button, Card, ScrollView, SafeArea, Circle, getBlinkThemePalettes } from '@blinkdotnew/mobile-ui';
import { Mic, Moon, Star, Sparkles, ChevronRight } from '@blinkdotnew/mobile-ui';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  const { data: recentDreams } = useQuery({
    queryKey: ['recentDreams'],
    queryFn: async () => {
      return await blink.db.dreams.list({
        limit: 3,
        orderBy: { created_at: 'desc' }
      });
    }
  });

  return (
    <SafeArea flex={1} backgroundColor="$color1">
      <ScrollView padding="$4" gap="$6">
        <YStack gap="$2" marginTop="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Paragraph color="$color10" size="$3">Good morning,</Paragraph>
              <H1 size="$8">Ready to record?</H1>
            </YStack>
            <Circle size="$5" backgroundColor="$color3" elevation={2}>
              <Moon size={24} color="$color9" />
            </Circle>
          </XStack>
        </YStack>

        <Card 
          onPress={() => router.push('/record')}
          padding="$0" 
          borderRadius="$6" 
          overflow="hidden" 
          elevation={8}
        >
          <LinearGradient
            colors={['#4f46e5', '#9333ea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 24, alignItems: 'center', gap: 16 }}
          >
            <Circle size={80} backgroundColor="rgba(255,255,255,0.2)" elevation={4}>
              <Mic size={40} color="white" />
            </Circle>
            <YStack alignItems="center">
              <H4 color="white">Record Your Dream</H4>
              <Paragraph color="rgba(255,255,255,0.8)" textAlign="center">
                Tap to speak and let AI analyze your subconscious
              </Paragraph>
            </YStack>
            <Button 
              backgroundColor="white" 
              color="#4f46e5" 
              borderRadius="$full"
              onPress={() => router.push('/record')}
            >
              Start Recording
            </Button>
          </LinearGradient>
        </Card>

        <YStack gap="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <H4>Recent Dreams</H4>
            <Button chromeless onPress={() => router.push('/history')}>
              <XStack gap="$2" alignItems="center">
                <Paragraph color="$color9">View All</Paragraph>
                <ChevronRight size={16} color="$color9" />
              </XStack>
            </Button>
          </XStack>

          {recentDreams?.map((dream: any) => (
            <Card 
              key={dream.id} 
              onPress={() => router.push(`/dreams/${dream.id}`)}
              padding="$4"
              elevation={2}
              backgroundColor="$color2"
            >
              <XStack gap="$4" alignItems="center">
                <Circle size="$4" backgroundColor="$color3">
                  <Star size={18} color="$color9" />
                </Circle>
                <YStack flex={1}>
                  <H4 size="$4">{dream.title}</H4>
                  <Paragraph color="$color10" size="$2" numberOfLines={1}>
                    {new Date(dream.created_at).toLocaleDateString()} • {dream.mood}
                  </Paragraph>
                </YStack>
                <Sparkles size={18} color="$color9" />
              </XStack>
            </Card>
          ))}

          {recentDreams?.length === 0 && (
            <Card padding="$8" alignItems="center" backgroundColor="$color2" borderStyle="dashed" borderWidth={1} borderColor="$color4">
              <Moon size={40} color="$color5" />
              <Paragraph color="$color10" marginTop="$2">No dreams recorded yet.</Paragraph>
            </Card>
          )}
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}
