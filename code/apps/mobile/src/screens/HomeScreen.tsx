import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>LyricShare</Text>
        <Text style={styles.subtitle}>Learn languages through music</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Songs</Text>
          <View style={styles.card}>
            <View style={styles.cardCover} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Hello</Text>
              <Text style={styles.cardArtist}>Adele</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardCover} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Dynamite</Text>
              <Text style={styles.cardArtist}>BTS</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardCover} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Despacito</Text>
              <Text style={styles.cardArtist}>Luis Fonsi</Text>
            </View>
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  cardCover: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  cardArtist: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
});
