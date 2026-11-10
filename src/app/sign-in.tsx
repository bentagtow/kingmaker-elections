import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);

    const { error } = codeSent
      ? await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' })
      : await supabase.auth.signInWithOtp({ email: email.trim() });

    setBusy(false);
    if (error) setError(error.message);
    else setCodeSent(true);
  }

  const inputStyle = [styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.form}>
        <ThemedText type="subtitle">{codeSent ? 'Enter your code' : 'Sign in'}</ThemedText>
        <ThemedText themeColor="textSecondary">
          {codeSent ? `We sent a code to ${email.trim()}.` : "We'll email you a sign-in code."}
        </ThemedText>

        {codeSent ? (
          <TextInput
            style={inputStyle}
            placeholder="Code"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            value={code}
            onChangeText={setCode}
          />
        ) : (
          <TextInput
            style={inputStyle}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        )}

        {error && <ThemedText themeColor="textSecondary">{error}</ThemedText>}

        <Pressable
          disabled={busy || !(codeSent ? code.trim() : email.trim())}
          onPress={submit}
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundSelected" style={styles.button}>
            {busy ? <ActivityIndicator /> : <ThemedText>{codeSent ? 'Verify' : 'Send code'}</ThemedText>}
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    fontSize: 16,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  button: {
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
});
