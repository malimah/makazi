const { Client, Databases, Storage } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('682865cf003e73ffa31e')
    .setKey('standard_02e79a2a781f382fdf0dc43d9ecaa4eae70a945cdc89a9150c4b4657d32e93dfac0ac52911109c2528d0830e8a30b062bdcd33480d69cda1832279a54e4ff273da7dfc277206abb0817c4e04fe219977bb39b58d3fb027');

const databases = new Databases(client);
const storage = new Storage(client);

// Database and Collection IDs - Updated to match the correct properties collection
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d'; // Correct properties collection ID
const BUCKET_ID = '682b32c2003a04448deb';

async function deleteProperty(propertyId) {
    try {
        console.log(`🗑️ Attempting to delete property: ${propertyId}`);
        
        // First, get the property to check if it exists and get image info
        const property = await databases.getDocument(DATABASE_ID, COLLECTION_ID, propertyId);
        console.log('Property found:', property.title);
        
        // Delete the document
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, propertyId);
        console.log('✅ Document deleted successfully');
        
        // Delete the image if it exists
        if (property.imageUrl && property.imageUrl !== 'placeholder') {
            try {
                await storage.deleteFile(BUCKET_ID, property.imageUrl);
                console.log('✅ Image deleted successfully');
            } catch (imageError) {
                console.warn('⚠️ Failed to delete image:', imageError.message);
            }
        }
        
        console.log('✅ Property deleted completely');
        
    } catch (error) {
        console.error('❌ Error deleting property:', error.message);
        if (error.code === 404) {
            console.log('Property not found');
        } else if (error.code === 401) {
            console.log('Not authorized to delete this property');
        }
    }
}

// Get property ID from command line argument
const propertyId = process.argv[2];

if (!propertyId) {
    console.log('Usage: node scripts/delete-property.js <property-id>');
    console.log('Example: node scripts/delete-property.js 64f8a1b2c3d4e5f6a7b8c9d0');
    process.exit(1);
}

deleteProperty(propertyId); 