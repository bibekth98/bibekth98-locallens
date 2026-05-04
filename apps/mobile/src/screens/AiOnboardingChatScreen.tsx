import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RootStackScreenProps } from '@/navigation/types';
import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

type Props = RootStackScreenProps<'AiOnboarding'>;

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

export default function AiOnboardingChatScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: t('screens.aiOnboarding.greeting'),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // TODO: wire to POST /ai/onboarding via apiClient
    // The response will be streamed back and appended as an assistant message.
  }, [input]);

  const handleSkip = useCallback(() => {
    navigation.replace('Overview3D');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('screens.aiOnboarding.title')}</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skip}>{t('common.next')}</Text>
          </TouchableOpacity>
        </View>

        {/* Message list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'assistant' ? styles.assistantBubble : styles.userBubble,
              ]}
            >
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
          )}
        />

        {/* Input row */}
        <View style={[styles.inputRow, GlassStyles.sheet]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t('screens.aiOnboarding.placeholder')}
            placeholderTextColor={Colors.midGray}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>{t('screens.aiOnboarding.send')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  skip: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.gold,
  },
  messageList: { padding: Spacing.lg, flexGrow: 1 },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.sm,
  },
  assistantBubble: {
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.gold,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.sm,
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sendBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.deepNavy,
  },
});
