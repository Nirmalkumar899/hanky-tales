'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // High-poly geometry for deformation - Reduced base size
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 64), []);

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#475569", // Slate-600 (Slightly lighter charcoal for better shadow def)
        roughness: 0.9, // Matte Paper feel
        metalness: 0.0,
        flatShading: false,
        side: THREE.DoubleSide,
    }), []);

    // Store original positions for lerping
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

            // ANIMATION PHASES
            // 0s-2.5s: THE ISSUE (Chaos, Dark, Crumpled)
            // 2.5s-4.0s: THE TRANSITION (Smoothing, Whitening)
            // 4.0s-6.0s: THE SOLUTION (Smooth, Floating, White)

            // Progress factor (0 = Crumpled, 1 = Smooth)
            const transitionProgress = THREE.MathUtils.smoothstep(time, 2.0, 4.0);

            // 1. COLOR & MATERIAL TRANSITION
            // Dark Charcoal (#334155) -> Pure White (#ffffff)
            // Roughness 0.8 -> 0.5 (Fabric)
            const startColor = new THREE.Color("#475569");
            const endColor = new THREE.Color("#ffffff");

            (mesh.material as THREE.MeshStandardMaterial).color.lerpColors(startColor, endColor, transitionProgress);

            // Emissive for "Anger" phase?
            // (mesh.material as THREE.MeshPhysicalMaterial).emissive = new THREE.Color("#ff0000").multiplyScalar(1 - transitionProgress * 2);

            // 2. VERTEX DEFORMATION (The Crumple)
            // Reduced amplitude for "Paper Ball" look, not "Spiky Glitch"
            const noiseAmp = THREE.MathUtils.lerp(0.5, 0, transitionProgress);
            // Noise speed
            const speed = time * 2;

            for (let i = 0; i < count; i++) {
                const ox = originalPositions[i * 3];
                const oy = originalPositions[i * 3 + 1];
                const oz = originalPositions[i * 3 + 2];

                // Simple pseudo-random noise function based on position & time
                // We use sin/cos waves to distort
                // Higher frequency noise for "Paper Wrinkles"
                const noiseX = Math.sin(ox * 3 + speed) * Math.cos(oy * 4 + speed);
                const noiseY = Math.cos(oz * 4 + speed) * Math.sin(ox * 4 + speed);
                const noiseZ = Math.sin(oy * 3 + speed) * Math.cos(oz * 3 + speed);

                // Apply noise
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
                // Shake vigorously
                const shake = (1 - transitionProgress) * 0.05;
                mesh.rotation.x += (Math.random() - 0.5) * shake;
                mesh.rotation.y += (Math.random() - 0.5) * shake;
                // Keep it smaller initially
                mesh.scale.setScalar(0.8);
            } else {
                // Float gently
                mesh.rotation.x = Math.sin(time * 0.5) * 0.1;
                mesh.rotation.y += 0.005;
                // Float & Expand slightly as it smooths
                const openScale = THREE.MathUtils.lerp(0.8, 1.2, (transitionProgress - 0.9) * 10); // Expand at end
                mesh.scale.setScalar(Math.min(openScale, 1.2));
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
            {/* Fill Light - Cool Blue for shadows */}
            <pointLight position={[-5, -5, 5]} intensity={2} color="#e0f2fe" />
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
