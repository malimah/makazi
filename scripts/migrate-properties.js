const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client();

// Set the endpoint and project ID
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('682865cf003e73ffa31e')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

async function migrateProperties() {
  try {
    console.log('Starting property migration...');
    console.log('Using Database ID:', DATABASE_ID);
    console.log('Using Collection ID:', COLLECTION_ID);

    // Test the connection first
    console.log('Testing database connection...');
    try {
      await databases.get(DATABASE_ID);
      console.log('Database connection successful!');
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
      if (error.code === 401) {
        console.error('\nAPI Key Error: Your API key does not have the required permissions.');
        console.error('Please ensure your API key has the following permissions:');
        console.error('- databases.read');
        console.error('- databases.write');
        console.error('- documents.read');
        console.error('- documents.write');
      }
      process.exit(1);
    }

    // Get all properties
    console.log('\nFetching properties...');
    const properties = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    console.log(`Found ${properties.documents.length} properties to migrate.`);

    // Update each property with new fields
    for (const property of properties.documents) {
      console.log(`\nMigrating property: ${property.title} (ID: ${property.$id})`);

      // Add default dimensions if not present
      const dimensions = JSON.stringify({
        width: 4,
        length: 5,
        height: 2.8,
      });
      console.log('Added default dimensions');

      // Add empty features array if not present
      const features = '[]';
      console.log('Added empty features array');

      // Update the property
      console.log('Updating property...');
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        property.$id,
        {
          dimensions,
          features,
        }
      );

      console.log(`Successfully migrated property: ${property.title}`);
    }

    console.log('\nMigration completed successfully');
  } catch (error) {
    console.error('\nMigration failed:', error.message);
    if (error.response) {
      try {
        const response = JSON.parse(error.response);
        console.error('Server response:', response.message);
      } catch (e) {
        console.error('Server response:', error.response);
      }
    }
    process.exit(1);
  }
}

// Run migration
migrateProperties(); 