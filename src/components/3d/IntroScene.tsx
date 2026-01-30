'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Wireframe } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const groupRef = useRef<THREE.Group>(null);

    // High density plane for the "weave" look
    const geometry = useMemo(() => new THREE.PlaneGeometry(8, 8, 128, 128), []);

    // Material starts as wireframe-like (handled via props or separate mesh, 
    // but standard material wireframe is easy to toggle/lerp opacity if we use two meshes)
    // Let's use a single mesh and manipulate wireframe prop? No, can't anim wireframe linewidth easily in WebGL1/2 without shader.
    // approach: Use a custom shader or a high-segment mesh with wireframe material overlay.
    // Simpler approach: 
    // 1. MeshPhysicalMaterial (The Tissue) - initially invisible/transparent
    // 2. MeshBasicMaterial (The Fibers) - wireframe: true - initially visible

    const tissueMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.1,
        transmission: 0,
        thickness: 1,
        transparent: true,
        opacity: 0,
    }), []);

    // We'll use a second mesh for the wireframe "Fibers"
    const fiberMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: "#aaddff", // Cyan-ish for "Tech/Science" feel initially
        wireframe: true,
        transparent: true,
        opacity: 1,
    }), []);

    const originalPositions = useMemo(() => {
        return geometry.attributes.position.array.slice();
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Animation Timeline:
        // 0s - 2.0s: Micro View (Wireframe, close up, tech color)
        // 2.0s - 4.5s: Zoom Out + Solidify (Wireframe fade out, Tissue fade in, White color)

        const duration = 5.0;
        // const progress = Math.min(time / duration, 1); // Not used

        // Zoom / Transformation Factor
        const zoomFactor = THREE.MathUtils.smoothstep(time, 0.5, 4.0);

        if (groupRef.current) {
            // --- 1. Camera & Position (The Zoom) ---
            // We simulate zoom by moving the mesh away from camera (or scaling it down visually)
            // Start very close: Z = 0.5? 
            const startZ = 1.5; // Very close to camera
            const endZ = -2;   // Normal viewing distance

            // Non-linear zoom for dramatic effect
            const currentZ = THREE.MathUtils.lerp(startZ, endZ, Math.pow(zoomFactor, 0.5));
            groupRef.current.position.z = currentZ;

            // --- 2. Wave Animation ---
            // Micro view: High freq vibration (molecular?)
            // Macro view: Gentle cloth wave
            const positions = geometry.attributes.position;
            const count = positions.count;

            for (let i = 0; i < count; i++) {
                const ox = originalPositions[i * 3];
                const oy = originalPositions[i * 3 + 1];

                // Micro Vibration
                const vibFreq = 20.0;
                const vibAmp = (1 - zoomFactor) * 0.02;
                const vibZ = Math.sin(ox * vibFreq + time * 10) * Math.cos(oy * vibFreq) * vibAmp;

                // Macro Wave
                const waveX = Math.sin(ox * 0.5 + time) * 0.2 * zoomFactor;
                const waveY = Math.sin(oy * 0.3 + time) * 0.2 * zoomFactor;
                const waveZ = Math.sin((ox + oy) * 0.5 + time) * 0.5 * zoomFactor;

                positions.setZ(i, vibZ + waveZ);
            }
            positions.needsUpdate = true;
            geometry.computeVertexNormals();

            // --- 3. Material Transition ---
            // Children[0] is Fiber (Wireframe)
            // Children[1] is Tissue (Solid)
            // We can access materials directly since we have the refs to them via useMemo

            // Fade out fibers
            fiberMaterial.opacity = 1 - Math.pow(zoomFactor, 2); // Fade out quickly
            // Change fiber color from Tech Blue to White as it fades
            fiberMaterial.color.lerpColors(new THREE.Color("#00ffff"), new THREE.Color("#ffffff"), zoomFactor);

            // Fade in tissue
            tissueMaterial.opacity = zoomFactor;

            // Rotation
            groupRef.current.rotation.z = time * 0.05;
            // Tilt slightly as we zoom out
            groupRef.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI / 6, zoomFactor);

            if (time > duration) {
                onComplete();
            }
        }
    });

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <spotLight position={[0, 0, 10]} angle={0.5} penumbra={1} intensity={1} />

            <group ref={groupRef}>
                {/* Wireframe Mesh (The Micro Fibers) */}
                <mesh geometry={geometry} material={fiberMaterial} />

                {/* Solid Mesh (The Tissue) */}
                <mesh geometry={geometry} material={tissueMaterial} />
            </group>

            {/* Particles appearing at the end */}
            <Sparkles
                count={50}
                scale={8}
                size={3}
                speed={0.2}
                opacity={0.5}
                color="#fff"
                position={[0, 0, -3]}
            />
        </>
    );
}
