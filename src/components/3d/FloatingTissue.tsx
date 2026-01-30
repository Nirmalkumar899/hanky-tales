'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingTissue() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Create geometry with enough segments for smooth wave animation
    const geometry = useMemo(() => new THREE.PlaneGeometry(3, 3, 32, 32), []);

    // Store original positions for wave calculation
    const originalPositions = useMemo(() => {
        return geometry.attributes.position.array.slice();
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (meshRef.current) {
            // Gentle floating rotation
            meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1 + Math.PI / 4;
            meshRef.current.rotation.y = Math.sin(time * 0.15) * 0.1;
            meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;

            // Wave animation on vertices
            const positions = meshRef.current.geometry.attributes.position;
            const count = positions.count;

            for (let i = 0; i < count; i++) {
                const x = originalPositions[i * 3];
                const y = originalPositions[i * 3 + 1];
                // const z = originalPositions[i * 3 + 2]; // original z is 0 for plane

                // Create wave effect based on x and y coordinates + time
                // Multi-frequency wave for more natural cloth look
                const waveX = Math.sin(x * 1.5 + time * 1.2) * 0.2;
                const waveY = Math.sin(y * 2.0 + time * 1.5) * 0.15;
                const waveZ = Math.sin((x + y) * 1.0 + time * 0.8) * 0.1;

                positions.setZ(i, waveX + waveY + waveZ);
            }

            positions.needsUpdate = true;

            // Update normals for correct lighting
            meshRef.current.geometry.computeVertexNormals();
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial
                color="#ffffff"
                side={THREE.DoubleSide}
                roughness={0.4}
                metalness={0.1}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
}
