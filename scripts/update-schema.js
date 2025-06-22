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

async function updateSchema() {
    try {
        console.log('Updating collection schema...');

        // First, create the dimensions attribute
        console.log('Adding dimensions attribute...');
        await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'dimensions',
            255,
            false,
            null,
            false
        );

        // Then create the features attribute
        console.log('Adding features attribute...');
        await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'features',
            255,
            false,
            null,
            true // array = true
        );

        // Add coordinates attribute
        console.log('Adding coordinates attribute...');
        await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'coordinates',
            255,
            false,
            null,
            false
        );

        console.log('Schema updated successfully!');
        console.log('\nNOTE: The attributes have been added as strings to store JSON data.');
        console.log('The migration script will handle the conversion between JSON and objects.');
    } catch (error) {
        console.error('\nSchema update failed:', error.message);
        if (error.response) {
            try {
                const response = JSON.parse(error.response);
                console.error('Server response:', response.message);
                
                // If the attribute already exists, that's okay
                if (response.type === 'attribute_already_exists') {
                    console.log('\nAttribute already exists, continuing...');
                    return;
                }
            } catch (e) {
                console.error('Server response:', error.response);
            }
        }
        process.exit(1);
    }
}

// Run the update
updateSchema(); 