import React from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { YStack, XStack, H1, H4, Paragraph, ScrollView, SafeArea, Badge, Button, Card, Circle, Spinner, Divider, ZStack } from '@blinkdotnew/mobile-ui';
import { ChevronLeft, Star, Heart, Share2, Sparkles, User, Activity, Tag } from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import { LinearGradient } from 'expo-linear-gradient';

export default function DreamDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: dream, isLoading } = useQuery({
    queryKey: ['dream', id],
    queryFn: async () => await blink.db.dreams.get(id as string)
  });

  if (isLoading) {
    return (
      <SafeArea flex={1} backgroundColor="$color1" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$color9" />
      </SafeArea>
    );
  }

  if (!dream) {
    return (
      <SafeArea flex={1} backgroundColor="$color1" justifyContent="center" alignItems="center">
        <Paragraph>Dream not found</Paragraph>
        <Button onPress={() => router.back()}>Go Back</Button>
      </SafeArea>
    );
  }

  const emotions = JSON.parse(dream.emotions || '[]');
  const characters = JSON.parse(dream.characters || '[]');
  const themes = JSON.parse(dream.themes || '[]');

  return (
    <YStack flex={1} backgroundColor="$color1">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView>
        <ZStack height={300}>
          <LinearGradient
            colors={['#4f46e5', '#9333ea']}
            style={{ flex: 1 }}
          />
          <SafeArea>
            <XStack padding="$4" justifyContent="space-between">
              <Circle size="$3" backgroundColor="rgba(0,0,0,0.3)" onPress={() => router.back()}>
                <ChevronLeft size={20} color="white" />
              </Circle>
              <XStack gap="$2">
                <Circle size="$3" backgroundColor="rgba(0,0,0,0.3)">
                  <Heart size={20} color="white" />
                </Circle>
                <Circle size="$3" backgroundColor="rgba(0,0,0,0.3)">
                  <Share2 size={20} color="white" />
                </Circle>
              </XStack>
            </XStack>
          </SafeArea>
          <YStack position="absolute" bottom={0} left={0} right={0} padding="$4" gap="$2">
            <Badge variant="default" backgroundColor="rgba(255,255,255,0.2)">{dream.mood}</Badge>
            <H1 color="white" size="$9">{dream.title}</H1>
            <Paragraph color="rgba(255,255,255,0.8)">{new Date(dream.created_at).toLocaleDateString()}</Paragraph>
          </YStack>
        </ZStack>

        <YStack padding="$4" gap="$6">
          <YStack gap="$2">
            <H4>The Dream</H4>
            <Paragraph lineHeight={24} color="$color11">
              {dream.content}
            </Paragraph>
          </YStack>

          <Divider />

          <YStack gap="$4">
            <XStack gap="$2" alignItems="center">
              <Sparkles size={20} color="$color9" />
              <H4>AI Interpretation</H4>
            </XStack>
            <Card padding="$4" backgroundColor="$color2" elevation={2}>
              <Paragraph lineHeight={24}>
                {dream.interpretation}
              </Paragraph>
            </Card>
          </YStack>

          <YStack gap="$4">
            <XStack gap="$2" alignItems="center">
              <Activity size={20} color="$color9" />
              <H4>Emotions</H4>
            </XStack>
            <XStack flexWrap="wrap" gap="$2">
              {emotions.map((e: string, i: number) => (
                <Badge key={i} variant="default">{e}</Badge>
              ))}
            </XStack>
          </YStack>

          <YStack gap="$4">
            <XStack gap="$2" alignItems="center">
              <User size={20} color="$color9" />
              <H4>Characters</H4>
            </XStack>
            <XStack flexWrap="wrap" gap="$2">
              {characters.map((c: string, i: number) => (
                <Badge key={i} variant="default" theme="green">{c}</Badge>
              ))}
            </XStack>
          </YStack>

          <YStack gap="$4">
            <XStack gap="$2" alignItems="center">
              <Tag size={20} color="$color9" />
              <H4>Key Themes</H4>
            </XStack>
            <XStack flexWrap="wrap" gap="$2">
              {themes.map((t: string, i: number) => (
                <Badge key={i} variant="default" theme="orange">{t}</Badge>
              ))}
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
