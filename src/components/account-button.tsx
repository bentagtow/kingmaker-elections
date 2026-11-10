import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/hooks/use-session';
import { supabase } from '@/lib/supabase';

export function AccountButton() {
  const { session } = useSession();

  return (
    <Pressable
      style={styles.button}
      onPress={() => (session ? supabase.auth.signOut() : router.push('/sign-in'))}>
      <ThemedText type="small">{session ? 'Sign out' : 'Sign in'}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.two,
  },
});
