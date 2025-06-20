import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { account } from '../utils/appwrite';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession('current');
        if (session) {
          const user = await account.get();
          console.log('Already logged in as:', user.email);
          // You could auto-redirect if needed here
        }
      } catch {
        console.log('No active session');
      } finally {
        setLoading(false);
      }

    };

    checkSession();
  }, []);

  const handleTenantPress = () => {
    router.push('/explore?userType=tenant');
  };

  const handleLandlordPress = () => {
    router.push('/sign-in?userType=landlord');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karibu Makazi Fasta</Text>
      <Text style={styles.subtitle}>Chagua Huduma</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleTenantPress}>
        <Text style={styles.buttonText}>Mimi ni Mpangaji</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLandlordPress}>
        <Text style={styles.buttonText}>Mimi ni Mwenye Nyumba</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
