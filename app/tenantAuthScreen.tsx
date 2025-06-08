// tenantAuthScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { account, ID } from '../utils/appwrite';
import { useRouter } from 'expo-router';

export default function TenantAuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true); // Always sign up for tenants
  const [method, setMethod] = useState<'phone' | 'email'>('email');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isValidPhone = (value: string) => /^\+?[1-9]\d{1,14}$/.test(value);
  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidPassword = (value: string) => value.length >= 6;

  const sendOtp = async () => {
    if (!isValidPhone(phone)) {
      Alert.alert('Invalid Phone', 'Enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      const userId = ID.unique();
      await account.createPhoneToken(userId, phone);
      setCurrentUserId(userId);
      setIsOtpSent(true);
      Alert.alert('OTP Sent', 'Please check your phone.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndSetPassword = async () => {
    if (!otp || !isValidPassword(password) || !currentUserId) {
      Alert.alert('Error', 'Invalid OTP or password.');
      return;
    }
    setLoading(true);
    try {
      await account.createSession(currentUserId, otp);
      await account.updatePassword(password);
      router.replace('/explore');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithEmail = async () => {
    console.log('Sign Up button pressed');
    if (!fullName.trim()) {
      Alert.alert('Name Required', 'Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert('Invalid Password', 'At least 6 characters.');
      return;
    }
    setLoading(true);
    console.log('Loading set to true (Sign Up)');
    try {
      await account.create(ID.unique(), email, password, fullName);
      Alert.alert(
        'Success',
        'Account created successfully! Please sign in.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsSignUp(false); // Switch to sign-in mode
              setFullName('');
            },
          },
        ]
      );
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        Alert.alert(
          'Email Already Registered',
          'This email is already registered. Please sign in instead.'
        );
        setIsSignUp(false); // Switch to sign-in mode
      } else {
        Alert.alert('Sign Up Error', err.message || JSON.stringify(err));
      }
    } finally {
      setLoading(false);
      console.log('Loading set to false (Sign Up)');
    }
  };

  const handleLoginWithPassword = async () => {
    console.log('Sign In button pressed');
    console.log('email:', email, 'password:', password);
    if (!isValidEmail(email)) {
      console.log('Invalid email');
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      console.log('Invalid password');
      Alert.alert('Invalid Password', 'At least 6 characters.');
      return;
    }
    setLoading(true);
    console.log('Loading set to true (Sign In)');
    try {
      await account.deleteSession('current');
      await account.createEmailPasswordSession(email, password);
      console.log('Login successful, redirecting...');
      router.replace('/explore');
    } catch (err: any) {
      console.log('Login error:', err);
      Alert.alert('Login Error', err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
      console.log('Loading set to false (Sign In)');
    }
  };

  // Add this just before your return statement to watch loading state changes:
  console.log('Render: loading =', loading);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? 'Tenant Sign Up' : 'Tenant Sign In'}
      </Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, method === 'email' && styles.activeToggle]}
          onPress={() => setMethod('email')}
        >
          <Text style={styles.toggleText}>Use Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, method === 'phone' && styles.activeToggle]}
          onPress={() => setMethod('phone')}
        >
          <Text style={styles.toggleText}>Use Phone</Text>
        </TouchableOpacity>
      </View>

      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      )}

      {(isSignUp && method === 'phone') ? (
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      )}

      {isSignUp && method === 'phone' && isOtpSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Set Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </>
      )}

      {((isSignUp && method === 'email') || (!isSignUp)) && (
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      )}

      {isSignUp ? (
        method === 'phone' && !isOtpSent ? (
          <TouchableOpacity style={styles.button} onPress={sendOtp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
          </TouchableOpacity>
        ) : method === 'phone' ? (
          <TouchableOpacity style={styles.button} onPress={verifyOtpAndSetPassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP & Set Password</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignUpWithEmail} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLoginWithPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  switchText: { color: '#555', textAlign: 'center', marginTop: 15, fontSize: 14 },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  toggleButton: { paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#4CAF50', borderRadius: 20, marginHorizontal: 5 },
  activeToggle: { backgroundColor: '#4CAF50' },
  toggleText: { color: '#fff', fontWeight: 'bold' },
});
