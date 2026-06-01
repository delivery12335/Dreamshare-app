import React, { useState } from 'react';
import { YStack, XStack, H1, Paragraph, SearchBar, ListItem, ScrollView, SafeArea, Badge, Circle, Spinner, EmptyState } from '@blinkdotnew/mobile-ui';
import { Star, Moon, Filter, Clock } from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { data: dreams, isLoading } = useQuery({
    queryKey: ['dreams', searchQuery],
    queryFn: async () => {
      return await blink.db.dreams.list({
        where: searchQuery ? {
          OR: [
            { title: { contains: searchQuery } },
            { content: { contains: searchQuery } },
            { mood: { contains: searchQuery } }
          ]
        } : undefined,
        orderBy: { created_at: 'desc' }
      });
    }
  });

  return (
    <SafeArea flex={1} backgroundColor="$color1">
      <YStack padding="$4" gap="$4" flex={1}>
        <H1 marginTop="$4">Dream History</H1>
        
        <SearchBar 
          placeholder="Search by title, mood or themes..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {isLoading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color="$color9" />
          </YStack>
        ) : dreams?.length === 0 ? (
          <EmptyState
            icon={<Moon size={60} color="$color5" />}
            title="No dreams found"
            description={searchQuery ? "Try a different search term" : "Start recording your dreams to see them here"}
            ctaLabel="Go Home"
            onPress={() => router.push('/')}
          />
        ) : (
          <ScrollView flex={1}>
            <YStack gap="$2">
              {dreams?.map((dream: any) => (
                <ListItem
                  key={dream.id}
                  title={dream.title}
                  subtitle={`${new Date(dream.created_at).toLocaleDateString()} • ${dream.mood}`}
                  icon={<Star size={20} color="$color9" />}
                  onPress={() => router.push(`/dreams/${dream.id}`)}
                  rightIcon={<Badge variant="default" size="small">{dream.mood}</Badge>}
                  backgroundColor="$color2"
                  borderRadius="$4"
                  marginBottom="$2"
                />
              ))}
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </SafeArea>
  );
}
