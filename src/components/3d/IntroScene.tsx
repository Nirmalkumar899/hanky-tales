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
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.2,
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
            // Let's say it starts at Z = -15 and moves to Z = 2

            const duration = 3.5;
            const progress = Math.min(time / duration, 1);

            // Easing function for smooth arrival
            const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
            const easedProgress = easeOutCubic(progress);

            const startZ = -10;
            const endZ = 3;

            meshRef.current.position.z = THREE.MathUtils.lerp(startZ, endZ, easedProgress);

            // 2. Rotation: Swirling effect
            // Rotate fast initially, slow down as it approaches
            meshRef.current.rotation.z = (1 - easedProgress) * Math.PI * 2;
            meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.5 + Math.PI / 3;
            meshRef.current.rotation.y = Math.cos(time * 0.3) * 0.5;

            // 3. Opacity: Fade in quickly
            if (progress < 0.2) {
                material.opacity = progress * 5;
            } else {
                material.opacity = 1;
            }

            // 4. Wave Animation (same as floating tissue but faster/more chaotic initially?)
            const positions = meshRef.current.geometry.attributes.position;
            const count = positions.count;

            for (let i = 0; i < count; i++) {
                const x = originalPositions[i * 3];
                const y = originalPositions[i * 3 + 1];

                // Large waving motion
                const waveX = Math.sin(x * 1.0 + time * 2.0) * 0.5;
                const waveY = Math.sin(y * 1.2 + time * 1.5) * 0.5;
                const waveZ = Math.sin((x + y) * 0.5 + time * 3.0) * 0.3;

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
            <ambientLight intensity={0.2} />
            <spotLight position={[0, 0, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
            <pointLight position={[-5, 5, -5]} intensity={1} color="#aaaaff" />

            <mesh ref={meshRef} geometry={geometry} material={material} />
        </>
    );
}
