'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // High-poly geometry: Plane (Sheet) instead of Icosahedron (Sphere)
    const geometry = useMemo(() => new THREE.PlaneGeometry(5, 5, 64, 64), []);

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.9,
        metalness: 0.0,
        flatShading: false,
        side: THREE.DoubleSide,
    }), []);

    // Store original positions (Flat Plane)
    const originalPositions = useMemo(() => {
        return Float32Array.from(geometry.attributes.position.array);
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 6.0;

        if (meshRef.current) {
            const mesh = meshRef.current;
            const posAttribute = mesh.geometry.attributes.position;
            const count = posAttribute.count;

            const transitionProgress = THREE.MathUtils.smoothstep(time, 2.0, 4.0);

            // 1. MATERIAL COLOR
            const startColor = new THREE.Color("#f8fafc");
            const endColor = new THREE.Color("#ffffff");
            (mesh.material as THREE.MeshStandardMaterial).color.lerpColors(startColor, endColor, transitionProgress);

            // 2. SHAPE TRANSITION: Ball -> Sheet
            // We want to bend the plane into a ball initially, then release it.
            const crumpleFactor = 1 - transitionProgress; // 1 = Ball, 0 = Sheet
            const noiseAmp = crumpleFactor * 1.5;
            const speed = time * 2;

            // Center of the plane is 0,0,0

            for (let i = 0; i < count; i++) {
                const ox = originalPositions[i * 3];
                const oy = originalPositions[i * 3 + 1];
                const oz = originalPositions[i * 3 + 2]; // 0 for plane

                // Noise
                const noiseX = Math.sin(ox * 2 + speed) * Math.cos(oy * 2.5 + speed);
                const noiseY = Math.cos(ox * 3 + speed) * Math.sin(oy * 3 + speed);
                const noiseZ = Math.sin(ox * 1.5 + speed) * Math.cos(oy * 1.5 + speed);

                // DEFORMATION LOGIC
                // Target: The flat plane (ox, oy, oz)
                // Crumpled: Vertices pulled towards a spherical volume + Noise

                // Simple "Ballify" mapping?
                // Just relying on Noise + Z-displacement is often enough for "Crumpled tissue".
                // Let's pull XY in slightly to make it look balled up, not just a wavy sheet.

                // Shrink factor for XY to make it compact when crumpled
                const shrink = THREE.MathUtils.lerp(1, 0.3, crumpleFactor);

                // Z-Displacement to give volume (Crumpled ball has thickness)
                // Wrap plain Z (0) into a volume
                // A sphere-like wrap could be: 
                // z = sin(ox) * cos(oy) * crumpleFactor * scale?
                // Simpler: Just lots of high amplitude XYZ noise makes it look 3D.

                let nx = ox * shrink + noiseX * noiseAmp;
                let ny = oy * shrink + noiseY * noiseAmp;
                let nz = oz + noiseZ * noiseAmp * 2; // Extra Height for crumple

                posAttribute.setXYZ(i, nx, ny, nz);
            }
            posAttribute.needsUpdate = true;
            mesh.geometry.computeVertexNormals();

            // 3. ROTATION / SCALE
            if (transitionProgress < 1) {
                // Fast spin/shake
                mesh.rotation.x += 0.02;
                mesh.rotation.y += 0.05;
                // Add shake
                mesh.position.x = (Math.random() - 0.5) * 0.1 * crumpleFactor;
            } else {
                // Gentle float
                mesh.rotation.x = Math.sin(time * 0.5) * 0.05; // Less sway to keep text clear
                mesh.rotation.y = Math.sin(time * 0.3) * 0.05;
                mesh.position.set(0, 0, 0);
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
