import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RoomFeature } from '../utils/roomPlanningUtils';

interface RoomFeatureEditorProps {
  features: RoomFeature[];
  onChange: (features: RoomFeature[]) => void;
}

export default function RoomFeatureEditor({ features, onChange }: RoomFeatureEditorProps) {
  const [newFeature, setNewFeature] = useState<Partial<RoomFeature>>({
    type: 'window',
    wall: 'north',
    position: 0.5,
    width: 1.0,
    height: 2.0,
  });

  const handleAddFeature = () => {
    if (
      newFeature.type &&
      newFeature.wall &&
      typeof newFeature.position === 'number' &&
      typeof newFeature.width === 'number' &&
      typeof newFeature.height === 'number'
    ) {
      onChange([...features, newFeature as RoomFeature]);
      // Reset form to default values
      setNewFeature({
        type: 'window',
        wall: 'north',
        position: 0.5,
        width: 1.0,
        height: 2.0,
      });
    }
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    onChange(newFeatures);
  };

  const renderPicker = (
    value: string,
    onValueChange: (value: string) => void,
    items: string[]
  ) => {
    if (Platform.OS === 'web') {
      return (
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          style={styles.webSelect}
        >
          {items.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    return (
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {items.map((item) => (
          <Picker.Item
            key={item}
            label={item.charAt(0).toUpperCase() + item.slice(1)}
            value={item}
          />
        ))}
      </Picker>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Features</Text>
      
      {/* Feature List */}
      <ScrollView style={styles.featureList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureText}>
              {feature.type.charAt(0).toUpperCase() + feature.type.slice(1)} on{' '}
              {feature.wall} wall at {Math.round(feature.position * 100)}%
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveFeature(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add New Feature Form */}
      <View style={styles.form}>
        <Text style={styles.subtitle}>Add New Feature</Text>
        
        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Type</Text>
            {renderPicker(
              newFeature.type || 'window',
              (value) => setNewFeature({ ...newFeature, type: value as 'window' | 'door' }),
              ['window', 'door']
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Wall</Text>
            {renderPicker(
              newFeature.wall || 'north',
              (value) => setNewFeature({ ...newFeature, wall: value as 'north' | 'south' | 'east' | 'west' }),
              ['north', 'south', 'east', 'west']
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Position (%)</Text>
            <TextInput
              style={styles.input}
              value={String(Math.round((newFeature.position || 0.5) * 100))}
              onChangeText={(text) => {
                const value = parseInt(text);
                if (!isNaN(value)) {
                  setNewFeature({ ...newFeature, position: value / 100 });
                }
              }}
              keyboardType="numeric"
              placeholder="50"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Width (m)</Text>
            <TextInput
              style={styles.input}
              value={String(newFeature.width || 1.0)}
              onChangeText={(text) => {
                const value = parseFloat(text);
                if (!isNaN(value)) {
                  setNewFeature({ ...newFeature, width: value });
                }
              }}
              keyboardType="numeric"
              placeholder="1.0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Height (m)</Text>
            <TextInput
              style={styles.input}
              value={String(newFeature.height || 2.0)}
              onChangeText={(text) => {
                const value = parseFloat(text);
                if (!isNaN(value)) {
                  setNewFeature({ ...newFeature, height: value });
                }
              }}
              keyboardType="numeric"
              placeholder="2.0"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFeature}
        >
          <Text style={styles.addButtonText}>Add Feature</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1da1f2',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  featureList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  form: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  webSelect: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#1da1f2',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 6,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
}); 