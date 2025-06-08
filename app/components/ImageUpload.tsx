import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface ImageUploadProps {
  onImageSelected: (file: File | ImagePicker.ImagePickerAsset) => void;
  currentImage?: string | null;
}

export default function ImageUpload({ onImageSelected, currentImage }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleImagePick = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'web') {
        // Web platform: Use input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        const file = await new Promise<File | null>((resolve) => {
          input.onchange = (e: any) => {
            const file = e.target?.files?.[0];
            if (file) {
              // Validate file
              if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                resolve(null);
                return;
              }
              if (file.size > 10 * 1024 * 1024) {
                alert('Image size should be less than 10MB');
                resolve(null);
                return;
              }
              // Create preview
              const reader = new FileReader();
              reader.onload = () => {
                setPreview(reader.result as string);
              };
              reader.readAsDataURL(file);
              resolve(file);
            } else {
              resolve(null);
            }
          };
          input.click();
        });

        if (file) {
          onImageSelected(file);
        }
      } else {
        // Native platform: Use ImagePicker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const asset = result.assets[0];
          
          // Check file size (if available)
          if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
            alert('Image size should be less than 10MB');
            return;
          }

          setPreview(asset.uri);
          onImageSelected(asset);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {preview ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: preview }}
            style={styles.preview}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleImagePick}
          >
            <Text style={styles.changeButtonText}>Change Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImagePick}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1da1f2" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={32} color="#1da1f2" />
              <Text style={styles.uploadText}>Upload Image</Text>
              <Text style={styles.uploadSubtext}>Click to select</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#1da1f2',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  uploadText: {
    fontSize: 16,
    color: '#1da1f2',
    marginTop: 8,
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  previewContainer: {
    width: '100%',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  changeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
}); 