import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { databases, ID, Permission, Role, account } from '../../utils/appwrite';
    
const DATABASE_ID = '68286dbc002bee374429';
const TENANTS_COLLECTION_ID = '682b5092003d9483de8f'; // <-- replace with your collection ID

export default function TenantList({ propertyId }: { propertyId: string }) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', leaseStatus: 'active', leaseStart: '', leaseEnd: '' });
  const [userId, setUserId] = useState<string | null>(null);

  // Get current landlord user ID
  useEffect(() => {
    account.get().then(user => setUserId(user.$id));
  }, []);

  // Fetch tenants for this property
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await databases.listDocuments(DATABASE_ID, TENANTS_COLLECTION_ID, [
          // Filter by propertyId if needed
        ]);
        setTenants(res.documents);
      } catch (err: any) {
        Alert.alert('Error fetching tenants', err.message || String(err));
      }
    };
    fetchTenants();
  }, []);

  // Add tenant
  const handleAddTenant = async () => {
    if (!form.name || !form.phone || !userId) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      const permissions = [
        Permission.read(Role.user(userId)),
        Permission.write(Role.user(userId)),
      ];
      const doc = await databases.createDocument(
        DATABASE_ID,
        TENANTS_COLLECTION_ID,
        ID.unique(),
        {
          ...form,
          propertyId,
        },
        permissions
      );
      setTenants([...tenants, doc]);
      setForm({ name: '', phone: '', leaseStatus: 'active', leaseStart: '', leaseEnd: '' });
    } catch (err: any) {
      Alert.alert('Error adding tenant', err.message || String(err));
    }
  };

  // Update tenant (for simplicity, only leaseStatus here)
  const handleUpdateTenant = async (tenantId: string, leaseStatus: string) => {
    try {
      await databases.updateDocument(DATABASE_ID, TENANTS_COLLECTION_ID, tenantId, { leaseStatus });
      setTenants(tenants.map(t => t.$id === tenantId ? { ...t, leaseStatus } : t));
    } catch (err: any) {
      Alert.alert('Error updating tenant', err.message || String(err));
    }
  };

  // Delete tenant
  const handleDeleteTenant = async (tenantId: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, TENANTS_COLLECTION_ID, tenantId);
      setTenants(tenants.filter(t => t.$id !== tenantId));
    } catch (err: any) {
      Alert.alert('Error deleting tenant', err.message || String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tenants</Text>
      <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={text => setForm({ ...form, name: text })} />
      <TextInput style={styles.input} placeholder="Phone" value={form.phone} onChangeText={text => setForm({ ...form, phone: text })} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Lease Start (YYYY-MM-DD)" value={form.leaseStart} onChangeText={text => setForm({ ...form, leaseStart: text })} />
      <TextInput style={styles.input} placeholder="Lease End (YYYY-MM-DD)" value={form.leaseEnd} onChangeText={text => setForm({ ...form, leaseEnd: text })} />
      <Button title="Add Tenant" onPress={handleAddTenant} />

      <FlatList
        data={tenants}
        keyExtractor={item => item.$id}
        renderItem={({ item }) => (
          <View style={styles.tenantCard}>
            <Text>{item.name} ({item.phone})</Text>
            <Text>Status: {item.leaseStatus}</Text>
            <Text>Lease: {item.leaseStart} to {item.leaseEnd}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Button title="End Lease" onPress={() => handleUpdateTenant(item.$id, 'ended')} />
              <Button title="Delete" color="red" onPress={() => handleDeleteTenant(item.$id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No tenants yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 8 },
  tenantCard: { backgroundColor: '#f1f1f1', padding: 10, borderRadius: 8, marginBottom: 10 },
});