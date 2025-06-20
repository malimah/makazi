const fs = require('fs');
const path = require('path');

// Sample furniture catalog
const FURNITURE_CATALOG = [
  {
    id: 'bed-single',
    name: 'Single Bed',
    category: 'Bedroom',
    dimensions: { width: 0.9, length: 2.0, height: 0.5 },
    price: 'TSh 250,000'
  },
  {
    id: 'sofa-3seater',
    name: '3-Seater Sofa',
    category: 'Living Room',
    dimensions: { width: 2.0, length: 0.85, height: 0.7 },
    price: 'TSh 450,000'
  },
  {
    id: 'dining-table',
    name: 'Dining Table',
    category: 'Dining Room',
    dimensions: { width: 1.5, length: 0.9, height: 0.75 },
    price: 'TSh 300,000'
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    category: 'Bedroom',
    dimensions: { width: 1.2, length: 0.6, height: 2.0 },
    price: 'TSh 400,000'
  }
];

// Create necessary directories and files
async function setup() {
  const publicDir = path.join(__dirname, '../public');
  const catalogPath = path.join(publicDir, 'furniture-catalog.json');

  try {
    // Create public directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('Created public directory');
    }

    // Write catalog data
    fs.writeFileSync(
      catalogPath,
      JSON.stringify(FURNITURE_CATALOG, null, 2)
    );
    console.log('Created furniture catalog');

    console.log('Setup completed successfully');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

setup(); 