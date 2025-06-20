import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Platform, useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { databases, account, ID } from '../../utils/appwrite';
import { MaterialIcons } from '@expo/vector-icons';

const DATABASE_ID = '68286dbc002bee374429';
const PROPERTIES_COLLECTION_ID = '68286efe002e00dbe24d';
const MESSAGES_COLLECTION_ID = '68286f2e002e00dbe24e';

export default function ContactLandlord() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const { width } = useWindowDimensions();
  const isNarrow = Platform.OS === 'web' && width < 768;

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get user session
        const currentUser = await account.get();
        setUser(currentUser);

        // Fetch property details
        const propertyData = await databases.getDocument(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          id as string
        );
        setProperty(propertyData);
      } catch (error) {
        console.error('Error initializing:', error);
        Alert.alert('Error', 'Failed to load necessary information');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!moveInDate.trim()) {
      Alert.alert('Error', 'Please enter your preferred move-in date');
      return;
    }

    try {
      setSending(true);

      // Create message document
      await databases.createDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        ID.unique(),
        {
          propertyId: id,
          tenantId: user.$id,
          landlordId: property.landlordId,
          message: message.trim(),
          phone: phone.trim(),
          moveInDate: moveInDate.trim(),
          status: 'Pending',
          createdAt: new Date().toISOString(),
        }
      );

      Alert.alert(
        'Success',
        'Your message has been sent to the landlord. They will contact you soon.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1da1f2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, isNarrow && styles.narrowContent]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1da1f2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Landlord</Text>
        </View>

        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{property?.title}</Text>
          <Text style={styles.propertyLocation}>{property?.location}</Text>
          <Text style={styles.propertyPrice}>
            TSh {property?.price.toLocaleString()} / month
          </Text>
        </View>

        {/* Contact Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Your Message</Text>
          <TextInput
            style={styles.messageInput}
            multiline
            numberOfLines={4}
            placeholder="Write your message to the landlord..."
            value={message}
            onChangeText={setMessage}
          />

          <Text style={styles.formLabel}>Your Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.formLabel}>Preferred Move-in Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your preferred move-in date (e.g., 2024-04-01)"
            value={moveInDate}
            onChangeText={setMoveInDate}
          />

          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendingButton]}
            onPress={handleSendMessage}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelines}>
          <Text style={styles.guidelinesTitle}>Important Information</Text>
          <Text style={styles.guidelineText}>
            • The landlord will receive your message and contact you directly
          </Text>
          <Text style={styles.guidelineText}>
            • Make sure to provide accurate contact information
          </Text>
          <Text style={styles.guidelineText}>
            • Be specific about your move-in date preferences
          </Text>
          <Text style={styles.guidelineText}>
            • Never send money before viewing the property
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  content: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
    padding: 20,
  },
  narrowContent: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14171a',
  },
  propertyInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14171a',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#657786',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1da1f2',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171a',
    marginBottom: 10,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendingButton: {
    backgroundColor: '#71c9f8',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guidelines: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171a',
    marginBottom: 15,
  },
  guidelineText: {
    fontSize: 14,
    color: '#657786',
    marginBottom: 10,
    lineHeight: 20,
  },
}); 