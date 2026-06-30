import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DEMO_LYRICS = [
  { text: 'Hello from the other side', start: 0, end: 3 },
  { text: 'I must have called a thousand times', start: 3, end: 6 },
  { text: 'To tell you I am sorry', start: 6, end: 8.5 },
  { text: 'For breaking my own heart', start: 8.5, end: 11 },
];

export function SongPlayerScreen() {
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.coverContainer}>
        <View style={styles.cover} />
      </View>

      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>Hello</Text>
        <Text style={styles.artistName}>Adele</Text>
      </View>

      <View style={styles.lyricsContainer}>
        {DEMO_LYRICS.map((line, i) => (
          <Text
            key={i}
            style={[
              styles.lyricLine,
              i === currentLine && styles.lyricLineActive,
            ]}
          >
            {line.text}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  coverContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  cover: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  songInfo: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  artistName: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  lyricsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  lyricLine: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.3)',
    marginVertical: 8,
    textAlign: 'center',
  },
  lyricLineActive: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  playButton: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  playIcon: {
    fontSize: 28,
    color: '#fff',
  },
});
