const https = require('https');
const fs = require('fs');
const path = require('path');

// Basic furniture models from Sketchfab (free models)
const MODELS = [
  {
    id: 'bed-single',
    url: 'https://sketchfab.com/models/bed-single/download',
    thumbnail: 'https://sketchfab.com/models/bed-single/thumbnail.jpg'
  },
  {
    id: 'sofa-3seater',
    url: 'https://sketchfab.com/models/sofa-3seater/download',
    thumbnail: 'https://sketchfab.com/models/sofa-3seater/thumbnail.jpg'
  },
  {
    id: 'dining-table',
    url: 'https://sketchfab.com/models/dining-table/download',
    thumbnail: 'https://sketchfab.com/models/dining-table/thumbnail.jpg'
  },
  {
    id: 'wardrobe',
    url: 'https://sketchfab.com/models/wardrobe/download',
    thumbnail: 'https://sketchfab.com/models/wardrobe/thumbnail.jpg'
  }
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    const request = https.get(url, response => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {
          reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        });
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close(() => {
          resolve();
        });
      });
    });

    request.on('error', err => {
      file.close();
      fs.unlink(dest, () => {
        reject(err);
      });
    });

    file.on('error', err => {
      file.close();
      fs.unlink(dest, () => {
        reject(err);
      });
    });
  });
};

async function downloadModels() {
  // Create directories if they don't exist
  const modelsDir = path.join(__dirname, '../public/models');
  const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
  
  try {
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    // Download each model and its thumbnail
    for (const model of MODELS) {
      console.log(`Downloading ${model.id}...`);
      
      try {
        const modelPath = path.join(modelsDir, `${model.id}.glb`);
        const thumbnailPath = path.join(thumbnailsDir, `${model.id}.jpg`);

        await downloadFile(model.url, modelPath);
        console.log(`Downloaded model: ${model.id}`);
        
        await downloadFile(model.thumbnail, thumbnailPath);
        console.log(`Downloaded thumbnail: ${model.id}`);
        
        console.log(`Successfully downloaded ${model.id}`);
      } catch (error) {
        console.error(`Error downloading ${model.id}:`, error.message);
      }
    }

    console.log('All downloads completed');
  } catch (error) {
    console.error('Error creating directories:', error.message);
  }
}

// Let's use some sample 3D models from a reliable source
const LOCAL_MODELS = [
  {
    name: 'Bed',
    path: path.join(__dirname, '../public/models/bed.glb'),
    content: `
      {
        "asset": {
          "version": "2.0",
          "generator": "Makazi Sample Models"
        },
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "meshes": [{
          "primitives": [{
            "attributes": {
              "POSITION": 0
            },
            "indices": 1
          }]
        }]
      }
    `
  },
  // Add more sample models as needed
];

// Function to create sample models if download fails
async function createSampleModels() {
  console.log('Creating sample 3D models...');
  
  for (const model of LOCAL_MODELS) {
    try {
      fs.writeFileSync(model.path, model.content);
      console.log(`Created sample model: ${model.name}`);
    } catch (error) {
      console.error(`Error creating sample model ${model.name}:`, error.message);
    }
  }
}

// Run the download process
downloadModels().catch(error => {
  console.error('Download script failed:', error.message);
  console.log('Creating sample models instead...');
  createSampleModels();
}); 