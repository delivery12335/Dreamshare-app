import React, { useState, useMemo } from 'react';
import { YStack, XStack, H1, SearchBar, ListItem, ScrollView, SafeArea, Badge, EmptyState, ChipGroup } from '@blinkdotnew/mobile-ui';
import { Star, Moon } from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import { useRouter } from 'expo-router';
import { Skeleton } from '@/components/Skeleton';

const MOODS = ['All', 'Wonder', 'Curiosity', 'Inspiration', 'Empowerment', 'Anxiety', 'Joy', 'Reverence', 'Peace', 'Apprehension', 'Ecstasy'];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  const router = useRouter();

  const { data: dreams, isLoading } = useQuery({
    queryKey: ['dreams', searchQuery, selectedMood],
    queryFn: async () => {
      const where: any = { AND: [] };
      
      if (searchQuery) {
        where.AND.push({
          OR: [
            { title: { contains: searchQuery } },
            { content: { contains: searchQuery } },
            { mood: { contains: searchQuery } }
          ]
        });
      }

      if (selectedMood !== 'All') {
        where.AND.push({ mood: selectedMood });
      }

      return await blink.db.dreams.list({
        where: where.AND.length > 0 ? where : undefined,
        orderBy: { created_at: 'desc' }
      });
    }
  });

  const moodChips = useMemo(() => MOODS.map(m => ({ id: m, label: m })), []);

  return (
    <SafeArea flex={1} backgroundColor="$color1">
      <YStack padding="$4" gap="$4" flex={1}>
        <H1 marginTop="$4">Dream History</H1>
        
        <SearchBar 
          placeholder="Search dreams..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <XStack>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ChipGroup 
              chips={moodChips} 
              selected={selectedMood} 
              onSelectionChange={setSelectedMood} 
            />
          </ScrollView>
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <YStack gap="$4">
              {[1, 2, 3, 4, 5].map(i => (
                <YStack key={i} gap="$2" padding="$4" backgroundColor="$color2" borderRadius="$4">
                  <Skeleton width="60%" height={24} />
                  <Skeleton width="40%" height={16} />
                </YStack>
              ))}
            </YStack>
          ) : dreams?.length === 0 ? (
            <EmptyState
              icon={<Moon size={60} color="$color5" />}
              title="No dreams found"
              description={searchQuery || selectedMood !== 'All' ? "Try adjusting your filters" : "Start recording your dreams to see them here"}
              ctaLabel={searchQuery || selectedMood !== 'All' ? "Clear Filters" : "Go Home"}
              onPress={() => {
                if (searchQuery || selectedMood !== 'All') {
                  setSearchQuery('');
                  setSelectedMood('All');
                } else {
                  router.push('/');
                }
              }}
            />
          ) : (
            <YStack gap="$2" paddingBottom="$4">
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
                  pressableProps={{
                    scale: 0.98,
                    opacity: 0.8
                  }}
                />
              ))}
            </YStack>
          )}
        </ScrollView>
      </YStack>
    </SafeArea>
  );
}
