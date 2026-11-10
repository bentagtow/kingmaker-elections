import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

type Person = {
  id: string;
  full_name: string;
  candidacies: { party_code: string; status: string }[];
};

export default function CandidatesScreen() {
  const theme = useTheme();
  const [people, setPeople] = useState<Person[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('people')
      .select('id, full_name, candidacies(party_code, status)')
      .order('full_name')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPeople(data);
      });
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (people ?? []).filter((person) => person.full_name.toLowerCase().includes(query));
  }, [people, search]);

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Could not load candidates: {error}</ThemedText>
      </ThemedView>
    );
  }

  if (!people) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        data={visible}
        keyExtractor={(person) => person.id}
        ListHeaderComponent={
          <TextInput
            style={[styles.search, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            placeholder="Search candidates"
            placeholderTextColor={theme.textSecondary}
            autoCorrect={false}
            value={search}
            onChangeText={setSearch}
          />
        }
        ListEmptyComponent={<ThemedText themeColor="textSecondary">No candidates found.</ThemedText>}
        renderItem={({ item }) => (
          <ThemedView type="backgroundElement" style={styles.row}>
            <ThemedText style={styles.name}>{item.full_name}</ThemedText>
            <View style={styles.parties}>
              {[...item.candidacies]
                .sort((a, b) => a.party_code.localeCompare(b.party_code))
                .map(({ party_code }) => (
                  <ThemedView key={party_code} type="backgroundSelected" style={styles.party}>
                    <ThemedText type="smallBold">{party_code}</ThemedText>
                  </ThemedView>
                ))}
            </View>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  list: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  search: {
    fontSize: 16,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
  parties: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  party: {
    width: Spacing.five,
    alignItems: 'center',
    borderRadius: Spacing.two,
  },
});
