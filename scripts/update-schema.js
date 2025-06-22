const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client();

// Set the endpoint and project ID
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('682865cf003e73ffa31e')
<<<<<<< HEAD
    .setKey(process.env.APPWRITE_API_KEY);
=======
    .setKey('standard_0774bc00bffe3ebd81f7e137630ce8ee2a94216f5ae04ff01fc68c70c5cf6bfd48d026c0c8796bed07d1a4bd1a494f2f3cf9b4ba165b1b43cfd4b0e19e5d2edc3d5be6182545dd529fd198d0eac244fa50b77633d93843d8265cd42ce4dff2200cf6b10b03130f7b32811b79ded80bb7bb2819808cf6acad64fc31a4004c0e6f');
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c

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

<<<<<<< HEAD
=======
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

>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
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

<<<<<<< HEAD
// Run schema update
=======
// Run the update
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
updateSchema(); 