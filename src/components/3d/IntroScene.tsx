'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // High segment geometry for detailed crumpling
    // Using Icosahedron for a "ball" shape that can unfurl, or Plane for "sheet"
    // Let's stick to Plane but warp it into a ball initially? 
    // actually, a sphere that smooths out might be weird. 
    // Let's use a Plane that is crumpled into a tight ball-like chaos, then expands.
    const geometry = useMemo(() => new THREE.PlaneGeometry(6, 6, 128, 128), []);

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ffffff", // Will start dark via lighting/color lerp
        side: THREE.DoubleSide,
        roughness: 0.4,
        metalness: 0.1,
        flatShading: true, // Low poly look for the crumple phase looks good
    }), []);

    const originalPositions = useMemo(() => {
        return geometry.attributes.position.array.slice();
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (meshRef.current) {
            const material = meshRef.current.material as THREE.MeshStandardMaterial;

            // Animation Timeline:
            // 0s - 1.5s: Crumpled, chaotic, dark (THE ISSUE)
            // 1.5s - 4.0s: Smooths out, expands, brightens (THE TISSUE)

            const duration = 5.0;
            const progress = Math.min(time / duration, 1);

            // Phase Logic
            // 0 = Crumpled, 1 = Smooth
            // We want it to stay crumpled for a bit, then smooth.
            const smoothFactor = THREE.MathUtils.smoothstep(time, 1.5, 3.5);

            // --- 1. Vertex Manipulation ---
            const positions = meshRef.current.geometry.attributes.position;
            const count = positions.count;

            for (let i = 0; i < count; i++) {
                const ox = originalPositions[i * 3];
                const oy = originalPositions[i * 3 + 1];
                const oz = originalPositions[i * 3 + 2];

                // Crumple Noise (High frequency, high amplitude)
                // We use position based noise to make it look like crumpled paper
                const noiseFreq = 2.0;
                const noiseAmp = (1 - smoothFactor) * 1.5; // Amplitude decreases as we smooth out

                const crumpleX = Math.sin(ox * noiseFreq + time * 5) * Math.cos(oy * noiseFreq) * noiseAmp;
                const crumpleY = Math.cos(ox * noiseFreq) * Math.sin(oy * noiseFreq + time * 5) * noiseAmp;
                const crumpleZ = Math.sin(ox * noiseFreq + oy * noiseFreq + time * 2) * noiseAmp;

                // Smooth Wave (Low frequency, gentle)
                const waveX = Math.sin(ox * 0.5 + time) * 0.2 * smoothFactor;
                const waveY = Math.sin(oy * 0.3 + time) * 0.2 * smoothFactor;
                const waveZ = Math.sin((ox + oy) * 0.5 + time) * 0.5 * smoothFactor;

                // Blend
                // When smoothFactor is 0, we are purely crumbled.
                // We also want to 'bunch up' the vertices towards center when crumpled.
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

            // Update shading: Flat shading for crumpled look, Smooth for tissue
            // material.flatShading = smoothFactor < 0.5; // Can't change flatShading runtime easily in Threejs without recompile
            // So we adjust roughness instead
            material.roughness = THREE.MathUtils.lerp(0.9, 0.2, smoothFactor);

            // --- 2. Color / Lighting ---
            // Start slightly grey/reddish (tension) -> Pure White (relief)
            const colorCrumpled = new THREE.Color("#4a4a4a"); // Dark grey
            const colorSmooth = new THREE.Color("#ffffff");
            material.color.lerpColors(colorCrumpled, colorSmooth, smoothFactor);

            // Emmisive boost at the end for "Heavenly" feel
            //   if (smoothFactor > 0.8) {
            material.emissive.setHex(0xffffff);
            material.emissiveIntensity = (smoothFactor - 0.8) * 0.5;
            //   } else {
            //       material.emissiveIntensity = 0;
            //   }

            // --- 3. Position / Rotation ---
            // Rotate fast and chaotic initially
            const rotSpeed = (1 - smoothFactor) * 2 + 0.2;
            meshRef.current.rotation.x += 0.01 * rotSpeed;
            meshRef.current.rotation.y += 0.02 * rotSpeed;

            // Move closer
            meshRef.current.position.z = THREE.MathUtils.lerp(-5, 0, smoothFactor);

            if (time > duration) {
                onComplete();
            }
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffaa00" /> {/* Slight warm undertone for the 'issue' phase */}

            <mesh ref={meshRef} geometry={geometry} material={material} />
        </>
    );
}
