import React, { useState, useRef } from 'react';
import { YStack, XStack, H1, H4, Paragraph, Button, Input, SafeArea, Circle, Spinner, toast } from '@blinkdotnew/mobile-ui';
import { Mic, X, Send, Sparkles } from '@blinkdotnew/mobile-ui';
import { useRouter } from 'expo-router';
import { blink } from '@/lib/blink';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function RecordScreen() {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const recordingRef = useRef<Audio.Recording | null>(null);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
      await recordingRef.current?.stopAndUnloadAsync();
      const uri = recordingRef.current?.getURI();
      if (uri) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        setIsAnalyzing(true);
        const { text } = await blink.ai.transcribeAudio({
          audio: base64,
          language: 'en'
        });
        setContent(prev => prev + ' ' + text);
        setIsAnalyzing(false);
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsAnalyzing(false);
    }
  };

  const analyzeMutation = useMutation({
    mutationFn: async (dreamContent: string) => {
      setIsAnalyzing(true);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      
      // 1. Analyze with AI
      const { object: analysis } = await blink.ai.generateObject({
        prompt: `Analyze this dream: "${dreamContent}"`,
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            mood: { type: 'string' },
            emotions: { type: 'array', items: { type: 'string' } },
            characters: { type: 'array', items: { type: 'string' } },
            themes: { type: 'array', items: { type: 'string' } },
            interpretation: { type: 'string' }
          },
          required: ['title', 'mood', 'interpretation']
        }
      });

      // 2. Save to DB
      const dream = await blink.db.dreams.create({
        user_id: 'user_1', // In a real app, use auth user id
        title: analysis.title,
        content: dreamContent,
        mood: analysis.mood,
        emotions: JSON.stringify(analysis.emotions),
        characters: JSON.stringify(analysis.characters),
        themes: JSON.stringify(analysis.themes),
        interpretation: analysis.interpretation,
        created_at: new Date().toISOString()
      });

      return dream;
    },
    onSuccess: (dream) => {
      queryClient.invalidateQueries({ queryKey: ['dreams'] });
      queryClient.invalidateQueries({ queryKey: ['recentDreams'] });
      setIsAnalyzing(false);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      router.replace(`/dreams/${dream.id}`);
      toast('Dream Analyzed!', { message: 'Your subconscious has been interpreted.', variant: 'success' });
    },
    onError: () => {
      setIsAnalyzing(false);
      toast('Error', { message: 'Failed to analyze dream. Please try again.', variant: 'error' });
    }
  });

  return (
    <SafeArea flex={1} backgroundColor="$color1">
      <YStack padding="$4" gap="$6" flex={1}>
        <XStack justifyContent="space-between" alignItems="center">
          <Circle size="$3" backgroundColor="$color3" onPress={() => router.back()}>
            <X size={20} color="$color9" />
          </Circle>
          <H4>New Entry</H4>
          <Circle size="$3" backgroundColor="transparent" />
        </XStack>

        <YStack flex={1} gap="$4">
          <Paragraph color="$color10">Describe your dream in detail or use the microphone...</Paragraph>
          <Input
            multiline
            numberOfLines={10}
            placeholder="I was in a forest made of mirrors..."
            value={content}
            onChangeText={setContent}
            backgroundColor="$color2"
            borderRadius="$4"
            padding="$4"
            height={300}
            textAlignVertical="top"
          />
        </YStack>

        <YStack gap="$4" alignItems="center">
          {isRecording ? (
            <YStack alignItems="center" gap="$2">
              <Circle 
                size={80} 
                backgroundColor="$red9" 
                onPress={stopRecording}
                animation="bouncy"
                scale={1.1}
              >
                <X size={40} color="white" />
              </Circle>
              <Paragraph color="$red9">Recording... Tap to stop</Paragraph>
            </YStack>
          ) : (
            <Circle 
              size={80} 
              backgroundColor="$color9" 
              onPress={startRecording}
              disabled={isAnalyzing}
            >
              <Mic size={40} color="white" />
            </Circle>
          )}

          <Button 
            theme="active" 
            width="100%" 
            size="$5"
            disabled={!content || isAnalyzing}
            onPress={() => analyzeMutation.mutate(content)}
            icon={isAnalyzing ? <Spinner /> : <Sparkles />}
          >
            {isAnalyzing ? 'Analyzing with AI...' : 'Analyze Dream'}
          </Button>
        </YStack>
      </YStack>
    </SafeArea>
  );
}
