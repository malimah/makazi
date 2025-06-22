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

async function checkSchema() {
    try {
        console.log('🔍 Checking collection schema...\n');
        
        // Get collection details
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        
        console.log(`📋 Collection: ${collection.name} (${collection.$id})`);
        console.log(`📊 Total attributes: ${collection.attributes.length}\n`);
        
        console.log('📝 Available attributes:');
        collection.attributes.forEach((attr, index) => {
            console.log(`${index + 1}. ${attr.key} (${attr.type})`);
            console.log(`   Required: ${attr.required}`);
            console.log(`   Array: ${attr.array || false}`);
            console.log(`   Size: ${attr.size || 'N/A'}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Error checking schema:', error.message);
        
        if (error.code === 401) {
            console.log('🔒 Authentication required - this is expected for security');
            console.log('The database exists but requires user authentication to access');
        } else if (error.code === 404) {
            console.log('🔍 Collection not found - check the collection ID');
        } else {
            console.log('❓ Unknown error - check the database configuration');
        }
    }
}

checkSchema(); 