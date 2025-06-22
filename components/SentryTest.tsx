import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as Sentry from 'sentry-expo';

export function SentryTest() {
  const triggerError = () => {
    throw new Error('Test error from button click');
  };

  const triggerPromiseError = () => {
    // This will cause an unhandled promise rejection
    Promise.reject(new Error('Test promise rejection'));
  };

  const triggerManualCapture = () => {
    // This will manually send an error to Sentry
    Sentry.Native.captureException(new Error('Manually captured error'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button 
          title="Trigger Error" 
          onPress={triggerError}
          color="#dc3545"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Trigger Promise Error" 
          onPress={triggerPromiseError}
          color="#ffc107"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Manual Error Capture" 
          onPress={triggerManualCapture}
          color="#28a745"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  buttonContainer: {
    marginVertical: 5,
  },
}); 