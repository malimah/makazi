import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { account, databases, storage, ID } from '../../../utils/appwrite';

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
  propertyImage: {
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  statusButtonActive: {
    backgroundColor: '#1da1f2',
  },
  statusText: {
    marginLeft: 4,
    color: '#666',
  },
  statusTextActive: {
    color: '#fff',
  },
});

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    beds: '0',
    baths: '0',
    guests: '0',
    status: 'Available',
    imageUrl: null,
    newImage: null as ImagePicker.ImagePickerAsset | File | null,
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id as string
      );

      setProperty(response);
      setForm({
        title: response.title,
        description: response.description || '',
        location: response.location,
        price: response.price.toString(),
        beds: response.beds?.toString() || '0',
        baths: response.baths?.toString() || '0',
        guests: response.guests?.toString() || '0',
        status: response.status || 'Available',
        imageUrl: response.imageUrl,
        newImage: null,
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      Alert.alert('Error', 'Failed to load property details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getImageUri = (imageId: string) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  const pickImage = async (useCamera: boolean = false) => {
    try {
      if (Platform.OS === 'web') {
        return new Promise<File | null>((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = () => {
            if (input.files && input.files[0]) {
              resolve(input.files[0]);
            } else {
              resolve(null);
            }
          };
          input.click();
        });
      } else {
        const result = useCamera
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });

        if (!result.canceled && result.assets[0]) {
          return result.assets[0];
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Validate form
      if (!form.title || !form.location || !form.price) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Get current user
      const user = await account.get();

      // Upload new image if selected
      let imageUrl = form.imageUrl;
      if (form.newImage) {
        let fileObj: any;
        if (Platform.OS === 'web') {
          fileObj = form.newImage;
        } else {
          fileObj = {
            uri: (form.newImage as ImagePickerAsset).uri,
            name: (form.newImage as ImagePickerAsset).fileName || `image_${Date.now()}.jpg`,
            type: (form.newImage as ImagePickerAsset).type || 'image/jpeg',
          };
        }

        const file = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          fileObj,
          [`read("user:${user.$id}")`, `write("user:${user.$id}")`]
        );

        // Delete old image
        if (form.imageUrl) {
          try {
            await storage.deleteFile(BUCKET_ID, form.imageUrl);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        imageUrl = file.$id;
      }

      // Update property document
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id as string,
        {
          title: form.title,
          description: form.description,
          location: form.location,
          price: parseFloat(form.price),
          beds: parseInt(form.beds),
          baths: parseInt(form.baths),
          guests: parseInt(form.guests),
          status: form.status,
          imageUrl,
        }
      );

      Alert.alert('Success', 'Property updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating property:', error);
      Alert.alert('Error', 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1da1f2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1da1f2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Property</Text>
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

        {/* Status */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          {['Available', 'Occupied', 'Under Maintenance'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                form.status === status && styles.statusButtonActive,
              ]}
              onPress={() => setForm({ ...form, status })}
            >
              <MaterialCommunityIcons
                name={
                  status === 'Available'
                    ? 'home-outline'
                    : status === 'Occupied'
                    ? 'home'
                    : 'home-wrench'
                }
                size={20}
                color={form.status === status ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.statusText,
                  form.status === status && styles.statusTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
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
          {(form.newImage || form.imageUrl) && (
            <Image
              source={{
                uri: form.newImage
                  ? Platform.OS === 'web'
                    ? URL.createObjectURL(form.newImage as File)
                    : (form.newImage as ImagePickerAsset).uri
                  : getImageUri(form.imageUrl),
              }}
              style={styles.propertyImage}
            />
          )}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={async () => {
              const image = await pickImage(false);
              if (image) setForm({ ...form, newImage: image });
            }}
          >
            <Ionicons name="image" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={async () => {
              const image = await pickImage(true);
              if (image) setForm({ ...form, newImage: image });
            }}
          >
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, saving && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.submitButtonText}>
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 