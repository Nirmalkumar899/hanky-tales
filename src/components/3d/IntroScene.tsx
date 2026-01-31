'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // High-poly geometry: Icosahedron (Sphere/Circle) as requested
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(2, 64), []);

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.9,
        metalness: 0.0,
        flatShading: false,
        side: THREE.DoubleSide,
    }), []);

    // Store original positions
    const originalPositions = useMemo(() => {
        return Float32Array.from(geometry.attributes.position.array);
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 1.4; // User requested ~1.5s

        if (meshRef.current) {
            const mesh = meshRef.current;
            const posAttribute = mesh.geometry.attributes.position;
            const count = posAttribute.count;

            // Flash transition
            const transitionProgress = THREE.MathUtils.smoothstep(time, 0.2, 1.0);

            // 1. MATERIAL COLOR
            const startColor = new THREE.Color("#f8fafc");
            const endColor = new THREE.Color("#ffffff");
            (mesh.material as THREE.MeshStandardMaterial).color.lerpColors(startColor, endColor, transitionProgress);

            // 2. VERTEX DEFORMATION (Crumpled Ball -> Smooth Sphere)
            // Fast decay
            const noiseAmp = THREE.MathUtils.lerp(1.2, 0, transitionProgress);
            const speed = time * 8; // Faster noise speed for "flash" effect

            for (let i = 0; i < count; i++) {
                const ox = originalPositions[i * 3];
                const oy = originalPositions[i * 3 + 1];
                const oz = originalPositions[i * 3 + 2];

                // Noise
                const noiseX = Math.sin(ox * 2 + speed) * Math.cos(oy * 2.5 + speed);
                const noiseY = Math.cos(oz * 3 + speed) * Math.sin(ox * 3 + speed);
                const noiseZ = Math.sin(oy * 2 + speed) * Math.cos(oz * 2 + speed);

                // Apply noise to original spherical position
                posAttribute.setXYZ(
                    i,
                    ox + noiseX * noiseAmp,
                    oy + noiseY * noiseAmp,
                    oz + noiseZ * noiseAmp
                );
            }
            posAttribute.needsUpdate = true;
            mesh.geometry.computeVertexNormals();

            // 3. ROTATION / SHAKE / SCALE
            if (transitionProgress < 1) {
                // Flash scale up
                mesh.rotation.y += 0.1;
                mesh.scale.setScalar(THREE.MathUtils.lerp(0.8, 1.2, transitionProgress)); // Grow slightly
            } else {
                mesh.scale.setScalar(1.2);
            }
        }

        if (time > duration) {
            onComplete();
        }
    });

    return (
        <>
            <color attach="background" args={['#ffffff']} /> {/* Clean White Background for contrast with dark ball */}

            {/* Cinematic Lighting: High Contrast */}
            <ambientLight intensity={0.5} />
            {/* Key Light */}
            <spotLight position={[5, 10, 5]} intensity={5} color="#ffffff" angle={0.5} penumbra={0.5} castShadow />
            {/* Fill Light - Neutral for shadows (was Blue) */}
            <pointLight position={[-5, -5, 5]} intensity={2} color="#f1f5f9" />
            {/* Rim Light - Warm for definition */}
            <spotLight position={[0, 5, -5]} intensity={10} color="#fff7ed" angle={1} />

            <Environment preset="studio" />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef} geometry={geometry} material={material} />
            </Float>

            {/* Subtle particles for magic feel */}
            <Sparkles count={50} scale={6} size={2} speed={0.4} opacity={0.5} color="#cbd5e1" />
        </>
    );
}
