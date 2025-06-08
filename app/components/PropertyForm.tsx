import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { RoomFeature } from '../utils/roomPlanningUtils';
import ImageUpload from './ImageUpload';
import { Picker } from '@react-native-picker/picker';

interface PropertyFormData {
  title: string;
  location: string;
  price: string;
  description: string;
  image: any;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  features: RoomFeature[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  initialValues?: Partial<PropertyFormData>;
}

const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Studio',
  'Duplex',
  'Penthouse',
];

export default function PropertyForm({ onSubmit, initialValues = {} }: PropertyFormProps) {
  const [form, setForm] = useState<PropertyFormData>({
    title: initialValues.title || '',
    location: initialValues.location || '',
    price: initialValues.price?.toString() || '',
    description: initialValues.description || '',
    image: initialValues.image || null,
    dimensions: initialValues.dimensions || {
      width: 4,
      length: 5,
      height: 2.8,
    },
    features: initialValues.features || [],
    coordinates: initialValues.coordinates || {
      latitude: -6.776012,
      longitude: 39.178326,
    },
  });

  const handleSubmit = () => {
    if (!form.title || !form.location || !form.price || !form.description || !form.image) {
      alert('Please fill in all required fields and add an image');
      return;
    }
    onSubmit(form);
  };

  const renderPropertyTypePicker = () => {
    if (Platform.OS === 'web') {
      return (
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
      );
    }

    return (
      <Picker
        selectedValue={form.type}
        onValueChange={(value) => setForm({ ...form, type: value })}
        style={styles.picker}
      >
        {PROPERTY_TYPES.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Property Details</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
          placeholder="Enter property title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Property Type</Text>
        {renderPropertyTypePicker()}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={(text) => setForm({ ...form, location: text })}
          placeholder="Enter property location"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Price (TSh)</Text>
        <TextInput
          style={styles.input}
          value={form.price}
          onChangeText={(text) => setForm({ ...form, price: text })}
          keyboardType="numeric"
          placeholder="Enter price"
        />
      </View>

      <View style={styles.formGroup}>
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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Room Dimensions (meters)</Text>
        <View style={styles.row}>
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

      {/* Room Features Editor */}
      <RoomFeatureEditor
        features={form.features}
        onChange={handleFeaturesChange}
      />

      <View style={styles.formGroup}>
        <Text style={styles.label}>Property Image</Text>
        <ImageUpload
          onImageSelected={(file) => setForm({ ...form, image: file })}
          currentImage={form.image?.uri}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Save Property</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1da1f2',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
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
  imagePicker: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#1da1f2',
    fontSize: 16,
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
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  webSelect: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
  },
}); 