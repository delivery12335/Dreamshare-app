import React, { useMemo } from 'react';
import { YStack, XStack, H2, Paragraph, Avatar, ScrollView, SafeArea, SettingsScreen, type SettingsSection, Circle, H4, Card } from '@blinkdotnew/mobile-ui';
import { User, Bell, Shield, LogOut, Moon, Activity, BarChart2, Star, Zap } from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';

export default function ProfileScreen() {
  const { data: dreams } = useQuery({
    queryKey: ['dreams'],
    queryFn: async () => await blink.db.dreams.list()
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const list = await blink.db.userProfiles.list({ limit: 1 });
      return list[0] || { display_name: 'Luna Dreamer', bio: 'Dream enthusiast' };
    }
  });

  const stats = useMemo(() => {
    if (!dreams) return [];
    
    const moodCounts: Record<string, number> = {};
    dreams.forEach(d => {
      moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
    });

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return [
      { label: 'Total Dreams', value: dreams.length, icon: <Moon size={20} color="$color9" />, theme: 'purple' },
      { label: 'Top Mood', value: topMood, icon: <Activity size={20} color="$color9" />, theme: 'green' },
      { label: 'Insights', value: `${dreams.length * 4} pts`, icon: <Zap size={20} color="$color9" />, theme: 'orange' },
    ];
  }, [dreams]);

  const sections: SettingsSection[] = [
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', title: 'Reminders', icon: <Bell size={18} />, type: 'toggle', value: true, onValueChange: () => {} },
        { id: 'privacy', title: 'Privacy Lock', icon: <Shield size={18} />, type: 'toggle', value: false, onValueChange: () => {} },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'edit', title: 'Edit Profile', icon: <User size={18} />, onPress: () => {} },
        { id: 'logout', title: 'Sign Out', icon: <LogOut size={18} />, color: '$red9', onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeArea flex={1} backgroundColor="$color1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$6">
          <YStack alignItems="center" gap="$3" marginTop="$6">
            <YStack position="relative">
              <Avatar 
                size="$10" 
                circular 
                source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=Luna' }} 
              />
              <Circle 
                size="$3" 
                backgroundColor="$color9" 
                position="absolute" 
                bottom={0} 
                right={0}
                borderWidth={2}
                borderColor="$color1"
              >
                <Star size={12} color="white" />
              </Circle>
            </YStack>
            <YStack alignItems="center">
              <H2>{profile?.display_name}</H2>
              <Paragraph color="$color10" textAlign="center">{profile?.bio}</Paragraph>
            </YStack>
          </YStack>

          <YStack gap="$4">
            <H4>Subconscious Insights</H4>
            <XStack gap="$3" flexWrap="wrap">
              {stats.map((stat, i) => (
                <Card 
                  key={i} 
                  flex={1} 
                  minWidth={100} 
                  padding="$4" 
                  backgroundColor="$color2" 
                  borderRadius="$6" 
                  elevation={2}
                  alignItems="center"
                  gap="$2"
                >
                  <Circle size="$3" backgroundColor="$color3">
                    {stat.icon}
                  </Circle>
                  <YStack alignItems="center">
                    <H2 size="$5">{stat.value}</H2>
                    <Paragraph size="$1" color="$color10" textAlign="center">{stat.label}</Paragraph>
                  </YStack>
                </Card>
              ))}
            </XStack>
          </YStack>

          <SettingsScreen sections={sections} />

          <Paragraph textAlign="center" color="$color7" size="$1" marginTop="$4" marginBottom="$8">
            DreamShare v1.0.0 • Made with ✨
          </Paragraph>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}
