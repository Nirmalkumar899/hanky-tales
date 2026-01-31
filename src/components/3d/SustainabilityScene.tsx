'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SustainabilityScene() {
    const groupRef = useRef<THREE.Group>(null);
    const earthRef = useRef<THREE.Mesh>(null);

    // Create scattered particles (leaves/seeds)
    const particleCount = 20;
    const particles = useMemo(() => {
        return new Array(particleCount).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ],
            scale: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.2
        }));
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.05;
        }

        if (earthRef.current) {
            // Earth breathing effect
            const scale = 1 + Math.sin(time * 0.5) * 0.02;
            earthRef.current.scale.setScalar(scale);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ambient Environment */}
            <color attach="background" args={['#F0FDF4']} /> {/* Very light green bg */}
            <ambientLight intensity={0.8} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#86efac" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#4ade80" />

            <Environment preset="forest" />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Central "Earth" Abstract */}
                <mesh ref={earthRef} position={[0, 0, 0]}>
                    <icosahedronGeometry args={[2.5, 2]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        roughness={0.4}
                        metalness={0.1}
                        wireframe={true}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Inner Solid Core */}
                <mesh position={[0, 0, 0]}>
                    <icosahedronGeometry args={[2.2, 4]} />
                    <meshStandardMaterial
                        color="#dcfce7"
                        roughness={0.8}
                    />
                </mesh>

                {/* Floating "Leaves" / Particles */}
                {particles.map((p, i) => (
                    <Float key={i} speed={1 + p.speed} rotationIntensity={1} floatIntensity={1}>
                        <mesh position={p.position as any} scale={p.scale}>
                            <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
                            <meshStandardMaterial color="#22c55e" />
                        </mesh>
                    </Float>
                ))}
            </Float>

            <Sparkles count={50} scale={12} size={4} speed={0.4} opacity={0.5} color="#4ade80" />
        </group>
    );
}
