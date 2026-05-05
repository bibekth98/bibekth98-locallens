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
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { sendChatMessage, ChatMessage } from '@/services/ai';
import { ApiError } from '@/services/api/client';
import {
  Colors,
  FontFamily,
  FontSize,
  GlassStyles,
  Spacing,
  GlobalStyles,
} from '@/theme';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

export default function AiChatScreen() {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessages, setLastMessages] = useState<ChatMessage[]>([]);

  const doSend = useCallback(async (chatMessages: ChatMessage[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sendChatMessage(chatMessages);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: res.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof ApiError
        ? `Error ${err.status}: ${String((err.body as { error?: { message?: string } })?.error?.message ?? err.message)}`
        : 'Failed to get response. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const updated: ChatMessage[] = [
      ...lastMessages,
      { role: 'user', content: trimmed },
    ];
    setLastMessages(updated);
    void doSend(updated);
  }, [input, isLoading, lastMessages, doSend]);

  const handleRetry = useCallback(() => {
    if (lastMessages.length > 0) {
      void doSend(lastMessages);
    }
  }, [lastMessages, doSend]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('screens.aiChat.title')}</Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
              <Text style={styles.retryText}>{t('common.retry', 'Retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('screens.aiChat.placeholder')}</Text>
          }
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
          ListFooterComponent={
            isLoading ? (
              <View style={styles.typingIndicator}>
                <ActivityIndicator color={Colors.gold} size="small" />
                <Text style={styles.typingText}>{t('common.loading', 'Thinking…')}</Text>
              </View>
            ) : null
          }
        />

        <View style={[styles.inputRow, GlassStyles.sheet]}>
          <TextInput
            style={[styles.input, GlassStyles.input]}
            value={input}
            onChangeText={setInput}
            placeholder={t('screens.aiChat.inputPlaceholder', 'Ask me anything…')}
            placeholderTextColor={Colors.midGray}
            multiline
            editable={!isLoading}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.deepNavy} size="small" />
            ) : (
              <Text style={styles.sendBtnText}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { ...GlobalStyles.screen },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  errorBanner: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(244,67,54,0.2)',
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 12,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: Colors.error,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    flex: 1,
    marginRight: Spacing.sm,
  },
  retryBtn: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  retryText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  messageList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    flexGrow: 1,
  },
  emptyText: {
    color: Colors.midGray,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  assistantBubble: {
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: Colors.gold,
    alignSelf: 'flex-end',
  },
  bubbleText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: Colors.midGray,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginLeft: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.goldDark,
  },
  sendBtnText: {
    fontSize: 20,
    color: Colors.deepNavy,
    fontFamily: FontFamily.bold,
  },
});
