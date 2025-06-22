import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UploadProgressProps {
  progress: number;
  fileName: string;
  size: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, fileName, size }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.fileName}>{fileName}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress}% ({size})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginVertical: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1da1f2',
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
});

export default UploadProgress;
