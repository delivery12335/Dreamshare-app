import React from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { YStack, XStack, H1, H4, Paragraph, ScrollView, SafeArea, Badge, Button, Card, Circle, Spinner, Divider, ZStack } from '@blinkdotnew/mobile-ui';
import { ChevronLeft, Star, Heart, Share2, Sparkles, User, Activity, Tag, ChevronRight } from '@blinkdotnew/mobile-ui';
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

  const { data: similarDreams } = useQuery({
    queryKey: ['similarDreams', dream?.mood, id],
    enabled: !!dream,
    queryFn: async () => {
      return await blink.db.dreams.list({
        where: {
          AND: [
            { mood: dream?.mood },
            { id: { not: id as string } }
          ]
        },
        limit: 3
      });
    }
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
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <ZStack height={350}>
          <LinearGradient
            colors={['#4f46e5', '#9333ea', '#1e1b4b']}
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
            <H1 color="white" size="$9" textShadowColor="rgba(0,0,0,0.5)" textShadowOffset={{ width: 0, height: 2 }} textShadowRadius={4}>{dream.title}</H1>
            <XStack gap="$2" alignItems="center">
              <Star size={14} color="white" />
              <Paragraph color="rgba(255,255,255,0.8)">{new Date(dream.created_at).toLocaleDateString()}</Paragraph>
            </XStack>
          </YStack>
        </ZStack>

        <YStack padding="$4" gap="$6">
          <YStack gap="$2">
            <H4>The Dream</H4>
            <Card padding="$4" backgroundColor="$color2" elevation={1}>
              <Paragraph lineHeight={24} color="$color11">
                {dream.content}
              </Paragraph>
            </Card>
          </YStack>

          <YStack gap="$4">
            <XStack gap="$2" alignItems="center">
              <Sparkles size={20} color="$color9" />
              <H4>AI Interpretation</H4>
            </XStack>
            <Card padding="$4" backgroundColor="$color1" borderColor="$color3" borderWidth={1} elevation={4}>
              <Paragraph lineHeight={24}>
                {dream.interpretation}
              </Paragraph>
            </Card>
          </YStack>

          <YStack gap="$4">
            <XStack gap="$2" alignItems="center">
              <Activity size={20} color="$color9" />
              <H4>Emotions & Analysis</H4>
            </XStack>
            <YStack gap="$3">
              <XStack flexWrap="wrap" gap="$2">
                {emotions.map((e: string, i: number) => (
                  <Badge key={i} variant="default" backgroundColor="$color3">{e}</Badge>
                ))}
              </XStack>
              
              <YStack gap="$2">
                <XStack gap="$2" alignItems="center">
                  <User size={16} color="$color7" />
                  <Paragraph size="$2" color="$color10">Characters: {characters.join(', ')}</Paragraph>
                </XStack>
                <XStack gap="$2" alignItems="center">
                  <Tag size={16} color="$color7" />
                  <Paragraph size="$2" color="$color10">Themes: {themes.join(', ')}</Paragraph>
                </XStack>
              </YStack>
            </YStack>
          </YStack>

          {similarDreams && similarDreams.length > 0 && (
            <YStack gap="$4">
              <H4>Similar Journeys</H4>
              <YStack gap="$2">
                {similarDreams.map((sd: any) => (
                  <Card 
                    key={sd.id} 
                    onPress={() => router.push(`/dreams/${sd.id}`)}
                    padding="$3"
                    backgroundColor="$color2"
                    elevation={1}
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack flex={1}>
                        <Paragraph fontWeight="600">{sd.title}</Paragraph>
                        <Paragraph size="$1" color="$color10">{new Date(sd.created_at).toLocaleDateString()}</Paragraph>
                      </YStack>
                      <ChevronRight size={16} color="$color7" />
                    </XStack>
                  </Card>
                ))}
              </YStack>
            </YStack>
          )}

          <Button 
            variant="outline" 
            borderColor="$red9" 
            color="$red9" 
            marginTop="$4"
            marginBottom="$8"
            onPress={() => {
              // Delete functionality could be added here
            }}
          >
            Archive Dream
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
