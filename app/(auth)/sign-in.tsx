import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/auth';

export default function AuthForm({
  userType = 'landlord',
  onSuccess = () => {},
}: {
  userType: 'landlord' | 'tenant',
  onSuccess?: () => void
}) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [showPassword, setShowPassword] = useState(false);

  // Reset form state
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setLoading(false);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setNotification({ message: '', type: '' }));
  };

  const handleLoginWithPassword = async () => {
    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }
    if (!isValidPassword(password)) {
      showNotification('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error, data: user } = await signIn(email, password);
      if (error) {
        throw error;
      }
      showNotification('Login successful!', 'success');
      
      // Handle redirection based on user type
      setTimeout(() => {
        if (userType === 'landlord') {
          router.replace('/landlord-dashboard');
        } else {
          router.replace('/explore');
        }
        onSuccess();
      }, 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      showNotification(err.message || 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithEmail = async () => {
    if (!fullName.trim()) {
      showNotification('Please enter your full name.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }
    if (!isValidPassword(password)) {
      showNotification('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error, data: user } = await signUp(email, password, fullName);
      if (error) {
        throw error;
      }
      showNotification('Account created successfully!', 'success');
      
      // Handle redirection based on user type
      setTimeout(() => {
        if (userType === 'landlord') {
          router.replace('/landlord-dashboard');
        } else {
          router.replace('/explore');
        }
        onSuccess();
      }, 1000);
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.message?.includes('already exists')) {
        showNotification('Account already exists. Please sign in instead.', 'error');
        setTimeout(() => {
          setIsSignUp(false);
          setPassword('');
        }, 2000);
      } else {
        showNotification(err.message || 'Failed to create account. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Notification Banner */}
      {notification.message && (
        <Animated.View
          style={[
            styles.notification,
            notification.type === 'success' ? styles.successNotification : styles.errorNotification,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.notificationText}>{notification.message}</Text>
        </Animated.View>
      )}

      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {`${isSignUp ? 'Sign Up' : 'Sign In'} as ${userType === 'landlord' ? 'Landlord' : 'Tenant'}`}
          </Text>
        </View>

        <View style={styles.formInner}>
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoComplete="name"
              placeholderTextColor="#666"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholderTextColor="#666"
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={isSignUp ? handleSignUpWithEmail : handleLoginWithPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setIsSignUp(!isSignUp);
              resetForm();
            }}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isValidPassword = (value: string) => value.length >= 6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  notification: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 40,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  successNotification: {
    backgroundColor: '#4CAF50',
  },
  errorNotification: {
    backgroundColor: '#f44336',
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: Platform.OS === 'web' ? 400 : '100%',
    width: '100%',
    alignSelf: 'center',
  },
  formInner: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }
      : { elevation: 4 }
    ),
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#1da1f2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  switchButton: {
    paddingVertical: 8,
  },
  switchText: {
    color: '#1da1f2',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 50, // Make room for the eye icon
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
});
