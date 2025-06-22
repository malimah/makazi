import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { account, databases, storage, ID, storageAPI } from '../../utils/appwrite';
import { Property } from '../../types';
import { RoomFeature } from '../utils/roomPlanningUtils';
import RoomFeatureEditor from '../components/RoomFeatureEditor';
import ImageUpload from '../components/ImageUpload';
import { Picker } from '@react-native-picker/picker';

const BUCKET_ID = '682b32c2003a04448deb';
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Studio',
  'Duplex',
  'Penthouse',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUploadContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1da1f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  amenityInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  amenityLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  numberInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 4,
    padding: 4,
    width: 50,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1da1f2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  webSelect: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  dimensionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default function NewPropertyScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    type: 'Apartment',
    beds: '0',
    baths: '0',
    guests: '0',
    status: 'Available',
    image: null as any,
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    dimensions: {
      width: 4,
      length: 5,
      height: 2.8,
    },
    features: [] as string[],
  });

  const handleSubmit = async () => {
    console.log('Starting form submission...');
    
    // Validate form
    if (!form.title || !form.description || !form.location || !form.price || !form.image) {
      console.log('Form validation failed');
      Alert.alert('Error', 'Please fill in all required fields and add an image');
      return;
    }

    setLoading(true);
    try {
      let uploadedFile;
      
      if (Platform.OS === 'web') {
        console.log('Web platform detected');
        // Validate file type and size for web
        const file = form.image as File;
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select a valid image file');
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error('Image size should be less than 10MB');
        }
        
        console.log('Uploading web file:', {
          type: file.type,
          size: file.size,
          name: file.name
        });
        uploadedFile = await storageAPI.uploadFile(file);
      } else {
        console.log('Native platform detected');
        const imageUri = form.image.uri;
        console.log('Image URI:', imageUri);
        
        // Fetch the image
        const response = await fetch(imageUri);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('Blob created:', {
          size: blob.size,
          type: blob.type
        });

        // Create file name with timestamp to avoid conflicts
        const fileName = `property-${Date.now()}.jpg`;
        const imageFile = new File([blob], fileName, {
          type: 'image/jpeg',
        });

        console.log('Created File object:', {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size
        });

        uploadedFile = await storageAPI.uploadFile(imageFile);
      }

      console.log('File uploaded successfully:', uploadedFile);

      // Get current user
      const user = await account.get();
      if (!user || !user.$id) {
        throw new Error('User not logged in');
      }

      // Create property document
      const property: any = {
        title: form.title,
        description: form.description,
        location: form.location,
        price: parseFloat(form.price),
        type: form.type,
        imageUrl: uploadedFile.$id,
        landlordId: user.$id,
        beds: parseInt(form.beds) || 0,
        baths: parseInt(form.baths) || 0,
        guests: parseInt(form.guests) || 0,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Only add dimensions if the field exists in schema (as string)
      if (form.dimensions) {
        property.dimensions = JSON.stringify(form.dimensions);
      }

      // Only add features if the field exists in schema (as string array)
      if (form.features && form.features.length > 0) {
        property.features = form.features;
      }

      console.log('Creating property document...');
      const createdProperty = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        property
      );

      console.log('Property created successfully:', createdProperty);
      Alert.alert('Success', 'Property added successfully');
      router.back();
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        type: error.constructor.name,
        stack: error.stack
      });
      
      // Show user-friendly error message
      const errorMessage = error.message.includes('storage/bucket')
        ? 'Storage system is not properly configured. Please contact support.'
        : error.message;
      
      Alert.alert('Error', `Failed to save property: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1da1f2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView style={styles.form}>
        {/* Basic Information */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Title *</Text>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            placeholder="Enter property title"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={form.location}
            onChangeText={(text) => setForm({ ...form, location: text })}
            placeholder="Enter property location"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (per month) *</Text>
          <TextInput
            style={styles.input}
            value={form.price}
            onChangeText={(text) => setForm({ ...form, price: text })}
            placeholder="Enter price"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            placeholder="Enter property description"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Property Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          {Platform.OS === 'web' ? (
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={styles.webSelect}
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          ) : (
            <Picker
              selectedValue={form.type}
              onValueChange={(value) => setForm({ ...form, type: value })}
              style={styles.picker}
            >
              {PROPERTY_TYPES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          )}
        </View>

        {/* Room Dimensions for 3D Model */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room Dimensions (meters) - For 3D Model</Text>
          <View style={styles.dimensionsRow}>
            <View style={styles.dimensionInput}>
              <Text style={styles.dimensionLabel}>Width</Text>
              <TextInput
                style={styles.input}
                value={String(form.dimensions.width)}
                onChangeText={(text) => {
                  const width = parseFloat(text) || 0;
                  setForm({
                    ...form,
                    dimensions: { ...form.dimensions, width },
                  });
                }}
                keyboardType="numeric"
                placeholder="4.0"
              />
            </View>

            <View style={styles.dimensionInput}>
              <Text style={styles.dimensionLabel}>Length</Text>
              <TextInput
                style={styles.input}
                value={String(form.dimensions.length)}
                onChangeText={(text) => {
                  const length = parseFloat(text) || 0;
                  setForm({
                    ...form,
                    dimensions: { ...form.dimensions, length },
                  });
                }}
                keyboardType="numeric"
                placeholder="5.0"
              />
            </View>

            <View style={styles.dimensionInput}>
              <Text style={styles.dimensionLabel}>Height</Text>
              <TextInput
                style={styles.input}
                value={String(form.dimensions.height)}
                onChangeText={(text) => {
                  const height = parseFloat(text) || 0;
                  setForm({
                    ...form,
                    dimensions: { ...form.dimensions, height },
                  });
                }}
                keyboardType="numeric"
                placeholder="2.8"
              />
            </View>
          </View>
        </View>

        {/* Room Features Editor for 3D Model */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room Features (for 3D Model)</Text>
          <RoomFeatureEditor
            features={form.features as unknown as RoomFeature[]}
            onChange={(features) => setForm({ ...form, features: features as unknown as string[] })}
          />
        </View>

        {/* Amenities */}
        <Text style={[styles.label, { marginBottom: 12 }]}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          <View style={styles.amenityInput}>
            <MaterialCommunityIcons name="bed" size={24} color="#1da1f2" />
            <Text style={styles.amenityLabel}>Beds:</Text>
            <TextInput
              style={styles.numberInput}
              value={form.beds}
              onChangeText={(text) => setForm({ ...form, beds: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.amenityInput}>
            <MaterialCommunityIcons name="shower" size={24} color="#1da1f2" />
            <Text style={styles.amenityLabel}>Baths:</Text>
            <TextInput
              style={styles.numberInput}
              value={form.baths}
              onChangeText={(text) => setForm({ ...form, baths: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.amenityInput}>
            <MaterialCommunityIcons name="account-group" size={24} color="#1da1f2" />
            <Text style={styles.amenityLabel}>Guests:</Text>
            <TextInput
              style={styles.numberInput}
              value={form.guests}
              onChangeText={(text) => setForm({ ...form, guests: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Image *</Text>
          <ImageUpload
            onImageSelected={(image) => setForm({ ...form, image })}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : 'Save Property'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 