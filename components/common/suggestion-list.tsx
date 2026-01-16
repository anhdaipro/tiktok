import { useTheme } from '@/contexts/theme-context';
import { useUserSearch } from '@/hooks/react-query/user/use-query-users';
import { useDebounce } from '@/hooks/use-debouce';
import { Image } from "expo-image";
import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SuggestionsProvidedProps } from 'react-native-controlled-mentions';

interface Props<T> extends SuggestionsProvidedProps {
  readonly saveUsers: (user: T) => void;
  readonly trigger?: string

}

export function SuggestionList<T>({ keyword = '', onSelect, saveUsers, trigger = "mention" }: Props<T>) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const deboucedKeyword = useDebounce(keyword, 500);
  const { data: users, isLoading } = useUserSearch(deboucedKeyword, trigger === "mention");
  const { data: hashtags, isLoading: isLoadingHashtags } = useUserSearch(deboucedKeyword, trigger === "hashtag");
  const mentions = users || hashtags;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#fe2c55" />
      </View>
    );
  }

  if (!mentions || mentions.length === 0) {
    return null;
  }

  return (
    <View style={styles.suggestionsContainer}>
      <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 200 }}>
        {mentions.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.suggestionItem}
            onPress={() => {
              onSelect({
                id: user.id,
                name: user.name,
              });
              saveUsers(user as T);
            }}
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userHandle}>{user.username}</Text>
            </View>
            <View style={styles.radioCircle} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    suggestionsContainer: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 5,
    },
    loadingContainer: {
      padding: 10,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
      backgroundColor: colors.surface,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    userHandle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
