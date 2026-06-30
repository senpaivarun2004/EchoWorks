import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search songs, artists, lyrics..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={styles.input}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hint}>Search for songs to learn from</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchBar: {
    padding: 16,
    paddingTop: 60,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  hint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});
