import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import PropertyList from '../app/components/PropertyList'; // adjust path if needed
import { databases, storage, account, Query } from '../utils/appwrite';


const BUCKET_ID = '682b32c2003a04448deb';
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

export default function MyProperty() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userId = '';
    account.get()
      .then(user => {
        userId = user.$id;
        // Adjust the query field below to match your schema (e.g., 'owner', 'userId', etc.)
        return databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal('userId', userId)]
        );
      })
      .then(res => {
        setProperties(res.documents);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const getImageUri = (imageId: string) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1da1f2" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>My Properties</Text>
      {properties.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
          You haven't posted any properties yet.
        </Text>
      ) : (
        <PropertyList properties={properties} getImageUri={getImageUri} />
      )}
    </View>
  );
}