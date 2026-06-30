import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export function LibraryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Library</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playlists</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No playlists yet</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vocabulary</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Learn words from songs</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
});
