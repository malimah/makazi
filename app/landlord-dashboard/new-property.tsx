import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { account, databases, storage, ID, storageAPI } from '../../utils/appwrite';
import { Property } from '../../types';

const BUCKET_ID = '682b32c2003a04448deb';
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

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
});

export default function NewPropertyScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
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
      width: 0,
      length: 0,
      height: 0,
    },
    features: [] as string[],
  });

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        console.log('Image picked:', result.assets[0]);
        setForm(prev => ({ ...prev, image: result.assets[0] }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

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

      // Create property document
      const property: Partial<Property> = {
        title: form.title,
        description: form.description,
        location: form.location,
        price: parseFloat(form.price),
        imageId: uploadedFile.$id,
        beds: parseInt(form.beds) || 0,
        baths: parseInt(form.baths) || 0,
        guests: parseInt(form.guests) || 0,
        coordinates: form.coordinates,
        dimensions: form.dimensions,
        features: form.features,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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
        <View style={styles.imageUploadContainer}>
          {form.image && (
            <Image
              source={{
                uri: Platform.OS === 'web'
                  ? URL.createObjectURL(form.image as File)
                  : (form.image as ImagePickerAsset).uri,
              }}
              style={styles.uploadedImage}
            />
          )}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImagePick}
          >
            <Ionicons name="image" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
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