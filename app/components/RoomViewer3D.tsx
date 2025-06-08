import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Room dimensions in meters
interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

interface RoomViewerProps {
  dimensions: RoomDimensions;
  furniture?: any[]; // Array of furniture objects with position, rotation, and model info
}

// Basic room structure
const Room = ({ dimensions }: { dimensions: RoomDimensions }) => {
  const { width, length, height } = dimensions;
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, height / 2, -length / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Measurements */}
      <group position={[0, 0.01, 0]}>
        {/* Width measurement */}
        <Text
          position={[0, 0, -length / 2 - 0.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#000000"
        >
          {`${width.toFixed(2)}m`}
        </Text>
        
        {/* Length measurement */}
        <Text
          position={[-width / 2 - 0.3, 0, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          fontSize={0.3}
          color="#000000"
        >
          {`${length.toFixed(2)}m`}
        </Text>
      </group>
    </group>
  );
};

// Grid helper
const Grid = () => {
  return (
    <gridHelper
      args={[20, 20, '#888888', '#cccccc']}
      position={[0, 0.01, 0]}
    />
  );
};

// Main component
export default function RoomViewer3D({ dimensions, furniture = [] }: RoomViewerProps) {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <PerspectiveCamera
          makeDefault
          position={[dimensions.width * 1.5, dimensions.height * 1.5, dimensions.length * 1.5]}
        />
        
        <Room dimensions={dimensions} />
        <Grid />
        
        {/* Furniture will be rendered here */}
        {furniture.map((item, index) => (
          <mesh key={index} {...item}>
            {/* Furniture meshes will be loaded here */}
          </mesh>
        ))}
        
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

// Example furniture component (to be expanded)
const Furniture = ({ model, position, rotation, scale }) => {
  const { scene } = useGLTF(model);
  
  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}; 