import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Import or load a 3D model (glasses or hat)
export function FashionModel({ modelPath, position = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(modelPath);
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <primitive object={scene} position={position} scale={scale} />
      <OrbitControls />
    </Canvas>
  );
}
