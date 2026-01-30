'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Reuse the tissue geometry logic but maybe make it larger/more dramatic
    const geometry = useMemo(() => new THREE.PlaneGeometry(5, 5, 64, 64), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#dddddd", // slight self-illumination to ensure it's WHITE
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide,
        roughness: 0.2, // smoother
        metalness: 0.1,
        transparent: true,
        opacity: 0,
    }), []);

    const originalPositions = useMemo(() => {
        return geometry.attributes.position.array.slice();
    }, [geometry]);

    useEffect(() => {
        // Start with 0 opacity and fade in
        if (meshRef.current) {
            // meshRef.current.material.opacity = 0;
        }
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (meshRef.current) {
            const material = meshRef.current.material as THREE.MeshStandardMaterial;

            // 1. Movement: Start far back and come forward
            // We want the animation to last about 3-4 seconds.
            const duration = 4.0; // Slightly longer for cinematic feel
            const progress = Math.min(time / duration, 1);

            // Easing function for smooth arrival
            const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
            const easedProgress = easeOutCubic(progress);

            const startZ = -15; // Start further back
            const endZ = 1.5; // End closer

            meshRef.current.position.z = THREE.MathUtils.lerp(startZ, endZ, easedProgress);

            // 2. Rotation: Elegant swirling
            meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.2; // Gentle sway
            // meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.5 + Math.PI / 3; 
            // More dynamic rotation to show off the "folds"
            meshRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, Math.PI / 4, easedProgress);
            meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.3;

            // 3. Opacity: Fade in 
            if (progress < 0.1) {
                material.opacity = progress * 10;
            } else {
                material.opacity = 1;
            }

            // 4. Wave Animation - smoother, more "silk-like"
            const positions = meshRef.current.geometry.attributes.position;
            const count = positions.count;

            for (let i = 0; i < count; i++) {
                const x = originalPositions[i * 3];
                const y = originalPositions[i * 3 + 1];

                // Large fluid motion
                const waveX = Math.sin(x * 0.5 + time * 1.5) * 0.8; // Broader waves
                const waveY = Math.sin(y * 0.5 + time * 1.2) * 0.8;
                const waveZ = Math.sin((x + y) * 0.3 + time * 1.0) * 0.5;

                positions.setZ(i, waveX + waveY + waveZ);
            }
            positions.needsUpdate = true;
            meshRef.current.geometry.computeVertexNormals();

            // Check for completion
            if (time > duration + 0.5) {
                onComplete();
            }
        }
    });

    return (
        <>
            {/* High intensity ambient light for pure white look */}
            <ambientLight intensity={1.5} />

            {/* Dramatic rim lighting */}
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" castShadow />
            <spotLight position={[-10, 0, 5]} angle={0.5} penumbra={1} intensity={1} color="#eefeff" />
            <pointLight position={[0, -5, 2]} intensity={0.5} color="#ffffff" />

            <mesh ref={meshRef} geometry={geometry} material={material} />
        </>
    );
}
