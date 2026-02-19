import { useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { useReducedMotion } from '@/shared/lib';
import type { Group, Object3DEventMap } from 'three';

/**
 * Inner 3D scene component that handles the model and rotation
 */
function RocketScene(): ReactNode {
    const modelRef = useRef<Group<Object3DEventMap>>(null);
    const prefersReducedMotion = useReducedMotion();

    // Resolve model URL using Vite base URL for correctness on deploy
    const modelUrl = useMemo(() => `${import.meta.env.BASE_URL}models/rocket-engine.glb`, []);
    // Load the GLB model
    const { scene } = useGLTF(modelUrl);

    // Auto-rotate the model around Y-axis
    useFrame(() => {
        if (modelRef.current && !prefersReducedMotion) {
            modelRef.current.rotation.y += 0.005; // Smooth continuous rotation
        }
    });

    return (
        <Bounds fit clip observe margin={1.1}>
            <Center>
                <primitive
                    ref={modelRef}
                    object={scene}
                    scale={1.6}
                    position={[0, 0, 0]}
                    // Set initial orientation so X points down, Y points right
                    rotation={[0, 0, -Math.PI / 2]}
                />
            </Center>
        </Bounds>
    );
}

/**
 * RocketModel Component
 * @description 3D rocket engine model with auto-rotation
 */
export function RocketModel(): ReactNode {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                minHeight: '560px',
                cursor: 'default',
                pointerEvents: 'none'
            }}
        >
            <Canvas
                camera={{ position: [0, 1.0, 2.4], fov: 35 }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
            >
                {/* Lighting - using basic Three.js lights instead of Environment */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.2}
                    color="#ffffff"
                    castShadow={false}
                />
                <directionalLight
                    position={[-5, 5, -5]}
                    intensity={0.6}
                    color="#88ccff"
                />
                <pointLight
                    position={[0, -5, 0]}
                    intensity={0.3}
                    color="#ff8844"
                />

                <RocketScene />
            </Canvas>
        </div>
    );
}

// Preload the model for better performance
useGLTF.preload(`${import.meta.env.BASE_URL}models/rocket-engine.glb`);
