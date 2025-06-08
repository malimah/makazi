import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { databases, storage, ID } from '../../utils/appwrite'; // Adjust the path as needed
import { account } from '../../utils/appwrite'; // make sure this is imported
// Removed duplicate styles declaration

export default function AddProperty() {
  const router = useRouter();
  const [propertyName, setPropertyName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

const handleSubmit = async () => {
  if (!propertyName || !location || !price || !description || !image) {
    Alert.alert('Error', 'Please fill in all fields and upload an image.');
    return;
  }

  setLoading(true);
  try {
    console.log('Uploading image:', image);

    const fileBlob = await fetch(image).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch image. Please try again.');
      return res.blob();
    });

    const file = await storage.createFile(
      '67f17d6600155e4507e8',
      ID.unique(),
      {
        name: 'property-image.jpg',
        type: fileBlob.type,
        size: fileBlob.size,
        uri: image,
      }
    );

    if (!file || !file.$id) throw new Error('Failed to upload image.');

    // Get logged-in user's ID
    const user = await account.get();
    console.log('logged-in user:', user);
    if (!user || !user.$id) throw new Error('User not logged in.');
    const landlordId = user.$id;

    // Create document with full attributes
    await databases.createDocument(
      '67f17c880005ce23b265',
      '67f17cdf003bfcb842f5',
      ID.unique(),
      {
        propertyName,
        location,
        price: parseInt(price),
        description,
        imageId: file.$id,
        landlordId,
        createdAt: new Date().toISOString(),
        isAvailable: true
      }
    );

    Alert.alert('✅ Success', 'Property added successfully!');
    router.replace('/app/landlord-dashboard');
  } catch (error: any) {
    console.error('❌ Error adding property:', error.message);
    Alert.alert('Error', error.message || 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add New Property</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter property name (e.g., Cozy Apartment)"
            value={propertyName}
            onChangeText={setPropertyName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter location (e.g., New York, NY)"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter price (e.g., 1200)"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter a brief description (e.g., 2-bedroom apartment with a balcony)"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>
              {image ? 'Change Image' : 'Upload Property Image'}
            </Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePicker: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});