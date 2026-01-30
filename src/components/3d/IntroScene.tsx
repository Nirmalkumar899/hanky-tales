'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);

    const geometry = useMemo(() => new THREE.PlaneGeometry(6, 6, 128, 128), []);

    // Use MeshPhysicalMaterial for better lighting/iridescence
    const material = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#000000",
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.2,
        transmission: 0,
        thickness: 0,
        clearcoat: 0,
    }), []);

    const originalPositions = useMemo(() => {
        return geometry.attributes.position.array.slice();
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (meshRef.current) {
            const material = meshRef.current.material as THREE.MeshPhysicalMaterial;

            const duration = 5.0;
            const progress = Math.min(time / duration, 1);

            // 0 = Crumpled/Dark, 1 = Smooth/White
            const smoothFactor = THREE.MathUtils.smoothstep(time, 1.0, 4.0);

            // --- 1. Vertex Manipulation (Crumple -> Wave) ---
            const positions = meshRef.current.geometry.attributes.position;
            const count = positions.count;

            for (let i = 0; i < count; i++) {
                const ox = originalPositions[i * 3];
                const oy = originalPositions[i * 3 + 1];
                const oz = originalPositions[i * 3 + 2];

                const noiseFreq = 2.0;
                const noiseAmp = (1 - smoothFactor) * 1.5;

                const crumpleX = Math.sin(ox * noiseFreq + time * 5) * Math.cos(oy * noiseFreq) * noiseAmp;
                const crumpleY = Math.cos(ox * noiseFreq) * Math.sin(oy * noiseFreq + time * 5) * noiseAmp;
                const crumpleZ = Math.sin(ox * noiseFreq + oy * noiseFreq + time * 2) * noiseAmp;

                const waveX = Math.sin(ox * 0.5 + time) * 0.2 * smoothFactor;
                const waveY = Math.sin(oy * 0.3 + time) * 0.2 * smoothFactor;
                const waveZ = Math.sin((ox + oy) * 0.5 + time) * 0.5 * smoothFactor;

                // Bunching effect when crumpled
                const bunchFactor = (1 - smoothFactor) * 0.8;

                positions.setXYZ(
                    i,
                    ox * (1 - bunchFactor) + crumpleX + waveX,
                    oy * (1 - bunchFactor) + crumpleY + waveY,
                    oz + crumpleZ + waveZ
                );
            }
            positions.needsUpdate = true;
            meshRef.current.geometry.computeVertexNormals();

            // --- 2. Color & Material Transition ---
            // Phase 1: Stress (0 - 0.3) -> Dark Red / Black / Jagged
            // Phase 2: Transmute (0.3 - 0.7) -> Pastel Explosion (Iridescent)
            // Phase 3: Relief (0.7 - 1.0) -> Pearl White / Soft

            if (smoothFactor < 0.3) {
                // Stress Phase
                const t = smoothFactor / 0.3;
                material.color.setHSL(0.95, 1, 0.1 + t * 0.1); // Deep Red to Dark Grey
                material.emissive.setHSL(0, 1, 0.2 * (1 - t)); // Glowing Red pulse
                material.roughness = 0.9 - t * 0.2;
            } else if (smoothFactor < 0.8) {
                // Rainbow/Pastel Phase
                const t = (smoothFactor - 0.3) / 0.5;
                // Cycle through pastel colors: Pink -> Cyan -> Mint
                const hue = (0.9 + t * 0.5) % 1;
                material.color.setHSL(hue, 0.8, 0.7);
                material.emissive.setHSL(hue, 1, 0.2);

                material.roughness = 0.7 - t * 0.5;
                material.metalness = 0.2 + t * 0.3;
                material.clearcoat = t; // Add shine
            } else {
                // White Phase
                const t = (smoothFactor - 0.8) / 0.2;
                const startColor = new THREE.Color().setHSL(0.4, 0.8, 0.7); // Minty start
                const endColor = new THREE.Color("#ffffff");

                material.color.lerpColors(startColor, endColor, t);
                material.emissive.setHex(0x000000); // Turn off emissive
                material.roughness = 0.2;
                material.metalness = 0.1;
                material.clearcoat = 1.0;
            }

            // --- 3. Position / Rotation ---
            const rotSpeed = (1 - smoothFactor) * 2 + 0.1;
            meshRef.current.rotation.x += 0.01 * rotSpeed;
            meshRef.current.rotation.y += 0.015 * rotSpeed;

            meshRef.current.position.z = THREE.MathUtils.lerp(-4, 0, smoothFactor);

            if (time > duration) {
                onComplete();
            }
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            {/* Dynamic Lighting Setup */}
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff00cc" /> {/* Magenta backlight for drama */}
            <spotLight position={[0, 0, 10]} angle={0.5} penumbra={1} intensity={2} />

            <mesh ref={meshRef} geometry={geometry} material={material} />

            {/* Magical Particles that appear as it smoothes out */}
            <Sparkles
                count={100}
                scale={10}
                size={4}
                speed={0.4}
                opacity={0.8}
                color="#fff"
                position={[0, 0, -2]}
            />
        </>
    );
}
