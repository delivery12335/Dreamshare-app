import React from 'react';
import { YStack, XStack, H2, Paragraph, Card, Avatar, ScrollView, SafeArea, Button, SettingsScreen, type SettingsSection, Circle } from '@blinkdotnew/mobile-ui';
import { User, Bell, Shield, LogOut, Moon, Activity, BarChart2 } from '@blinkdotnew/mobile-ui';
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

  const stats = [
    { label: 'Dreams', value: dreams?.length || 0, icon: <Moon size={20} color="$color9" /> },
    { label: 'Streak', value: '5 days', icon: <Activity size={20} color="$color9" /> },
    { label: 'Analysis', value: '100%', icon: <BarChart2 size={20} color="$color9" /> },
  ];

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
      <ScrollView>
        <YStack padding="$4" gap="$6">
          <YStack alignItems="center" gap="$3" marginTop="$6">
            <Avatar 
              size="$10" 
              circular 
              source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=Luna' }} 
            />
            <YStack alignItems="center">
              <H2>{profile?.display_name}</H2>
              <Paragraph color="$color10" textAlign="center">{profile?.bio}</Paragraph>
            </YStack>
          </YStack>

          <XStack justifyContent="space-around" backgroundColor="$color2" padding="$4" borderRadius="$6" elevation={2}>
            {stats.map((stat, i) => (
              <YStack key={i} alignItems="center" gap="$1">
                <Circle size="$3" backgroundColor="$color3">
                  {stat.icon}
                </Circle>
                <H2 size="$5">{stat.value}</H2>
                <Paragraph size="$1" color="$color10">{stat.label}</Paragraph>
              </YStack>
            ))}
          </XStack>

          <SettingsScreen sections={sections} />

          <Paragraph textAlign="center" color="$color7" size="$1" marginTop="$4">
            DreamShare v1.0.0 • Made with ✨
          </Paragraph>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}
