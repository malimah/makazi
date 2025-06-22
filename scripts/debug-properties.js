const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('682865cf003e73ffa31e')
    .setKey('standard_02e79a2a781f382fdf0dc43d9ecaa4eae70a945cdc89a9150c4b4657d32e93dfac0ac52911109c2528d0830e8a30b062bdcd33480d69cda1832279a54e4ff273da7dfc277206abb0817c4e04fe219977bb39b58d3fb027');

const databases = new Databases(client);

// Database and Collection IDs - Updated to match the correct properties collection
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d'; // Correct properties collection ID

async function debugProperties() {
    try {
        console.log('🔍 Debugging Properties...\n');

        // Get all properties
        console.log('📋 Fetching all properties...');
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        
        console.log(`Found ${response.documents.length} total properties:\n`);
        
        // Group properties by landlordId
        const propertiesByLandlord = {};
        response.documents.forEach(property => {
            const landlordId = property.landlordId || 'NO_LANDLORD_ID';
            if (!propertiesByLandlord[landlordId]) {
                propertiesByLandlord[landlordId] = [];
            }
            propertiesByLandlord[landlordId].push(property);
        });

        // Display properties grouped by landlord
        Object.keys(propertiesByLandlord).forEach(landlordId => {
            console.log(`🏠 Landlord ID: ${landlordId}`);
            console.log(`   Properties: ${propertiesByLandlord[landlordId].length}`);
            
            propertiesByLandlord[landlordId].forEach(property => {
                console.log(`   - ${property.title} (ID: ${property.$id}) - Status: ${property.status}`);
            });
            console.log('');
        });

        // Check for properties without landlordId
        const orphanedProperties = response.documents.filter(p => !p.landlordId);
        if (orphanedProperties.length > 0) {
            console.log('⚠️  WARNING: Found properties without landlordId:');
            orphanedProperties.forEach(property => {
                console.log(`   - ${property.title} (ID: ${property.$id})`);
            });
            console.log('');
        }

        // Check for duplicate titles
        const titles = response.documents.map(p => p.title);
        const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
        if (duplicates.length > 0) {
            console.log('⚠️  WARNING: Found duplicate property titles:');
            duplicates.forEach(title => {
                const propertiesWithTitle = response.documents.filter(p => p.title === title);
                console.log(`   - "${title}" appears ${propertiesWithTitle.length} times`);
            });
            console.log('');
        }

        console.log('✅ Debug complete!');
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
        if (error.response) {
            try {
                const response = JSON.parse(error.response);
                console.error('Server response:', response.message);
            } catch (e) {
                console.error('Server response:', error.response);
            }
        }
    }
}

// Run the debug
debugProperties(); 