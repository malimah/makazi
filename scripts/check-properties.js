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

async function checkProperties() {
    try {
        console.log('🔍 Checking properties in database...\n');
        
        // Try to get all properties (this might fail due to permissions)
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        
        console.log(`📊 Found ${response.documents.length} total properties:\n`);
        
        if (response.documents.length === 0) {
            console.log('❌ No properties found in the database');
            console.log('This could mean:');
            console.log('1. All properties were deleted');
            console.log('2. The collection is empty');
            console.log('3. There are permission issues');
        } else {
            response.documents.forEach((property, index) => {
                console.log(`${index + 1}. ${property.title || 'Untitled'}`);
                console.log(`   ID: ${property.$id}`);
                console.log(`   Landlord ID: ${property.landlordId || 'NO_LANDLORD_ID'}`);
                console.log(`   Status: ${property.status || 'Unknown'}`);
                console.log(`   Created: ${property.$createdAt}`);
                console.log('');
            });
        }
        
    } catch (error) {
        console.error('❌ Error checking properties:', error.message);
        
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

checkProperties(); 