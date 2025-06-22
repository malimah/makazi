import React from 'react';
import { View, Text as RNText } from 'react-native';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  mesh: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 25,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  camera: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    backgroundColor: '#007AFF',
    borderRadius: 15,
  },
};

// Mock Canvas component
export const Canvas = ({ children, ...props }) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.textContainer}>
        <RNText style={styles.text}>3D Canvas (Web Mock)</RNText>
        <RNText style={styles.text}>Three.js components are not available on web</RNText>
      </View>
    </View>
  );
};

// Mock Text component
export const Text = ({ children, ...props }) => {
  return (
    <View style={styles.textContainer}>
      <RNText style={styles.text}>{children}</RNText>
    </View>
  );
};

// Mock other Three.js components
export const useFrame = () => {};
export const useThree = () => ({
  camera: {},
  gl: {},
  scene: {},
  raycaster: {},
});

export const OrbitControls = () => null;
export const PerspectiveCamera = () => null;
export const Box = () => null;
export const Sphere = () => null;
export const Cylinder = () => null;
export const Plane = () => null;
export const Mesh = () => null;
export const MeshStandardMaterial = () => null;
export const AmbientLight = () => null;
export const DirectionalLight = () => null;
export const PointLight = () => null;
export const SpotLight = () => null;
export const Group = () => null;
export const Float = () => null;
export const PresentationControls = () => null;
export const Environment = () => null;
export const ContactShadows = () => null;
export const Html = () => null;
export const TransformControls = () => null;
export const PivotControls = () => null;
export const Line = () => null;
export const Points = () => null;
export const PointMaterial = () => null;
export const BufferGeometry = () => null;
export const Float32BufferAttribute = () => null;
export const Vector3 = () => null;
export const Vector2 = () => null;
export const Euler = () => null;
export const Quaternion = () => null;
export const Matrix4 = () => null;
export const Color = () => null;
export const Fog = () => null;
export const FogExp2 = () => null;
export const Clock = () => null;
export const Axes = () => null;
export const Grid = () => null;
export const Stats = () => null;
export const useGLTF = () => ({ nodes: {}, materials: {} });
export const useAnimations = () => ({ actions: {} });
export const useProgress = () => ({ progress: 0, loaded: 0, total: 0 });
export const useTexture = () => ({});
export const useCubeTexture = () => ({});
export const useVideoTexture = () => ({});
export const useSpring = () => ({});
export const useSprings = () => ({});
export const useTrail = () => ({});
export const useTransition = () => ({});
export const useChain = () => {};
export const useSpringRef = () => ({});
export const animated = {
  mesh: () => null,
  group: () => null,
  line: () => null,
  points: () => null,
  plane: () => null,
  box: () => null,
  sphere: () => null,
  cylinder: () => null,
  text: () => null,
  html: () => null,
  float: () => null,
  presentationControls: () => null,
  environment: () => null,
  contactShadows: () => null,
  transformControls: () => null,
  pivotControls: () => null,
  orbitControls: () => null,
  perspectiveCamera: () => null,
  ambientLight: () => null,
  directionalLight: () => null,
  pointLight: () => null,
  spotLight: () => null,
  meshStandardMaterial: () => null,
  bufferGeometry: () => null,
  float32BufferAttribute: () => null,
  vector3: () => null,
  vector2: () => null,
  euler: () => null,
  quaternion: () => null,
  matrix4: () => null,
  color: () => null,
  fog: () => null,
  fogExp2: () => null,
  clock: () => null,
  axes: () => null,
  grid: () => null,
  stats: () => null,
};

// Mock Three.js core
export const three = {
  Vector3: () => null,
  Vector2: () => null,
  Euler: () => null,
  Quaternion: () => null,
  Matrix4: () => null,
  Color: () => null,
  Fog: () => null,
  FogExp2: () => null,
  Clock: () => null,
  BufferGeometry: () => null,
  Float32BufferAttribute: () => null,
};

// Mock @react-spring/three
export const useSpringThree = () => ({});
export const useSpringsThree = () => ({});
export const useTrailThree = () => ({});
export const useTransitionThree = () => ({});
export const useChainThree = () => {};
export const useSpringRefThree = () => ({}); 