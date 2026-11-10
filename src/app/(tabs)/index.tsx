import { type Href, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useSession } from '@/hooks/use-session';
import { supabase } from '@/lib/supabase';

const DAY_MS = 24 * 60 * 60 * 1000;

const HOW_IT_WORKS = [
  {
    title: 'Start a league',
    body: 'Play with 2 to 8 teams. Invite friends, family or coworkers, and fill any empty seats with computer opponents.',
  },
  {
    title: 'Draft your candidates',
    body: 'Take turns picking who you think will go the distance. Anyone can be drafted as a Democrat or a Republican, but they only score under the party they actually run with.',
  },
  {
    title: 'Score as the race unfolds',
    body: 'Earn points when your candidates officially declare, stay in the race, win primaries and delegates, take the nomination, and win in November.',
  },
  {
    title: 'Finish on top',
    body: 'The team with the most points at the end wins. No money, just bragging rights.',
  },
];

function HomeLink({ href, label }: { href: Href; label: string }) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundSelected" style={styles.button}>
          <ThemedText>{label}</ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

function ElectionCountdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('races')
      .select('general_date')
      .eq('name', '2028 President')
      .single()
      .then(({ data }) => {
        if (!data) return;
        setDays(Math.ceil((new Date(`${data.general_date}T00:00:00`).getTime() - Date.now()) / DAY_MS));
      });
  }, []);

  if (days === null) return null;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="subtitle">{days.toLocaleString()}</ThemedText>
      <ThemedText themeColor="textSecondary">days until Election Day 2028</ThemedText>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const { session } = useSession();

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {session ? (
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Your leagues</ThemedText>
            <ThemedText themeColor="textSecondary">Your leagues will appear here.</ThemedText>
          </ThemedView>
        ) : (
          <>
            <ThemedText type="title">Kingmaker</ThemedText>
            <ThemedText type="subtitle">We don&apos;t pick sides, we just draft them.</ThemedText>
            <ThemedText themeColor="textSecondary">
              Make election season a team sport. Draft a team of candidates, compete with the people
              you know, and follow the race like never before. No money, no risk.
            </ThemedText>
            <HomeLink href="/sign-in" label="Sign in" />
          </>
        )}

        <HomeLink href="/candidates" label="Browse candidates" />
        <ElectionCountdown />

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">How it works</ThemedText>
          {HOW_IT_WORKS.map(({ title, body }, index) => (
            <ThemedView key={title} type="backgroundElement" style={styles.step}>
              <ThemedText type="smallBold">
                {index + 1}. {title}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {body}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  step: {
    marginTop: Spacing.two,
    gap: Spacing.half,
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
