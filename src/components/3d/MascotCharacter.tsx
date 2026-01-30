'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

export function MascotCharacter() {
    const groupRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Bobbing animation
            groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1 - 1.5; // Offset y to position lower
        }

        if (headRef.current) {
            // Look at mouse
            const { x, y } = state.mouse;
            // Interpolate rotation for smooth looking
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, x * 0.5, 0.1);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -y * 0.5, 0.1);
        }
    });

    return (
        <group ref={groupRef} position={[2, -1, -2]}>
            {/* Body */}
            <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#6B8E6F" />
            </Sphere>

            {/* Head */}
            <group position={[0, 0.6, 0]}>
                <mesh ref={headRef}>
                    <Sphere args={[0.4, 32, 32]}>
                        <meshStandardMaterial color="#FFD700" />
                    </Sphere>

                    {/* Eyes */}
                    <Sphere args={[0.08, 16, 16]} position={[-0.15, 0.1, 0.35]}>
                        <meshStandardMaterial color="black" />
                    </Sphere>
                    <Sphere args={[0.08, 16, 16]} position={[0.15, 0.1, 0.35]}>
                        <meshStandardMaterial color="black" />
                    </Sphere>

                    {/* Blush */}
                    <Sphere args={[0.05, 16, 16]} position={[-0.2, -0.05, 0.32]}>
                        <meshStandardMaterial color="#ffaaaa" />
                    </Sphere>
                    <Sphere args={[0.05, 16, 16]} position={[0.2, -0.05, 0.32]}>
                        <meshStandardMaterial color="#ffaaaa" />
                    </Sphere>
                </mesh>
            </group>

            {/* Arms (simple spheres for hands) */}
            <Sphere args={[0.15, 16, 16]} position={[-0.6, 0.1, 0]}>
                <meshStandardMaterial color="#6B8E6F" />
            </Sphere>
            <Sphere args={[0.15, 16, 16]} position={[0.6, 0.1, 0]}>
                <meshStandardMaterial color="#6B8E6F" />
            </Sphere>

        </group>
    );
}
