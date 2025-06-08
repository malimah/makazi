import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FurnitureControlsProps {
  onRotate: (axis: 'x' | 'y' | 'z', angle: number) => void;
  onMove: (axis: 'x' | 'y' | 'z', distance: number) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function FurnitureControls({
  onRotate,
  onMove,
  onDelete,
  onDuplicate,
}: FurnitureControlsProps) {
  return (
    <View style={styles.container}>
      {/* Movement Controls */}
      <View style={styles.controlGroup}>
        <Text style={styles.groupTitle}>Move</Text>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onMove('x', -0.1)}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1da1f2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onMove('z', -0.1)}
          >
            <MaterialIcons name="arrow-upward" size={24} color="#1da1f2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onMove('x', 0.1)}
          >
            <MaterialIcons name="arrow-forward" size={24} color="#1da1f2" />
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onMove('z', 0.1)}
          >
            <MaterialIcons name="arrow-downward" size={24} color="#1da1f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rotation Controls */}
      <View style={styles.controlGroup}>
        <Text style={styles.groupTitle}>Rotate</Text>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onRotate('y', Math.PI / 4)}
          >
            <MaterialIcons name="rotate-left" size={24} color="#1da1f2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onRotate('y', -Math.PI / 4)}
          >
            <MaterialIcons name="rotate-right" size={24} color="#1da1f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.controlGroup}>
        <Text style={styles.groupTitle}>Actions</Text>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.duplicateButton]}
            onPress={onDuplicate}
          >
            <MaterialIcons name="content-copy" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Duplicate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <MaterialIcons name="delete" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  controlGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#14171a',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f8fa',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  duplicateButton: {
    backgroundColor: '#1da1f2',
  },
  deleteButton: {
    backgroundColor: '#e0245e',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
}); 