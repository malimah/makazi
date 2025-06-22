const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('682865cf003e73ffa31e')
    .setKey('standard_02e79a2a781f382fdf0dc43d9ecaa4eae70a945cdc89a9150c4b4657d32e93dfac0ac52911109c2528d0830e8a30b062bdcd33480d69cda1832279a54e4ff273da7dfc277206abb0817c4e04fe219977bb39b58d3fb027');

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

async function addMissingFields() {
    try {
        console.log('🔧 Adding missing fields to collection schema...\n');

        // Add imageUrl attribute (string)
        console.log('📸 Adding imageUrl attribute...');
        try {
            await databases.createStringAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'imageUrl',
                255,
                false, // not required
                null, // default value
                false // not array
            );
            console.log('✅ imageUrl attribute added successfully');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('ℹ️ imageUrl attribute already exists');
            } else {
                console.error('❌ Failed to add imageUrl:', error.message);
            }
        }

        // Add dimensions attribute (string to store JSON)
        console.log('\n📏 Adding dimensions attribute...');
        try {
            await databases.createStringAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'dimensions',
                1000, // larger size for JSON
                false, // not required
                null, // default value
                false // not array
            );
            console.log('✅ dimensions attribute added successfully');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('ℹ️ dimensions attribute already exists');
            } else {
                console.error('❌ Failed to add dimensions:', error.message);
            }
        }

        // Add features attribute (string array)
        console.log('\n🏠 Adding features attribute...');
        try {
            await databases.createStringAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'features',
                255,
                false, // not required
                null, // default value
                true // array = true
            );
            console.log('✅ features attribute added successfully');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('ℹ️ features attribute already exists');
            } else {
                console.error('❌ Failed to add features:', error.message);
            }
        }

        console.log('\n🎉 Schema update completed!');
        console.log('\n📝 Summary of changes:');
        console.log('- imageUrl: string field for storing image file IDs');
        console.log('- dimensions: string field for storing JSON room dimensions');
        console.log('- features: string array for storing room features');
        
    } catch (error) {
        console.error('❌ Error updating schema:', error.message);
        
        if (error.code === 401) {
            console.log('🔒 Authentication required - check your API key permissions');
        } else if (error.code === 404) {
            console.log('🔍 Collection not found - check the collection ID');
        } else {
            console.log('❓ Unknown error - check the database configuration');
        }
    }
}

addMissingFields(); 