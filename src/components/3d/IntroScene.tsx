'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Environment, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const tissueRef = useRef<THREE.Mesh>(null);
    const textRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // --- 1. The Tissue Surface (Plush, Matte, Soft) ---
    const tissueGeometry = useMemo(() => new THREE.PlaneGeometry(10, 10, 256, 256), []);
    const tissueMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#fafafa", // Ivory White
        roughness: 0.9,   // Very matte (cloth)
        metalness: 0.0,
        clearcoat: 0.0,
        sheen: 1.0,       // Fabric sheen
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color("#ffffff"),
        transmission: 0,
        transparent: true,
        opacity: 0,       // Starts invisible
        side: THREE.DoubleSide
    }), []);

    // --- 2. The Floating Fibers (Particles) ---
    // Create thousands of particles scattered in a volume
    const particleCount = 2000;
    const particleGeo = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Spread widely initially
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5 + 4; // Closer to camera initially
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    const particleMaterial = useMemo(() => new THREE.PointsMaterial({
        color: "#a8a29e", // Stone-400 (Visible against ivory)
        size: 0.03,       // Slightly larger
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
    }), []);


    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 6.0; // Slow, luxurious timing

        // Timeline:
        // 0s - 2.5s: Fibers drifting (The Air)
        // 2.5s - 4.5s: Gathering & Surface Forming
        // 4.5s - 6.0s: Brand Embossing

        // Fiber Physics
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position;

            // Gather factor
            const gatherStart = 2.0;
            const gatherEnd = 4.5;
            const gatherProgress = THREE.MathUtils.smoothstep(time, gatherStart, gatherEnd);

            for (let i = 0; i < particleCount; i++) {
                if (gatherProgress > 0) {
                    // Move towards z=0 and center x,y
                    const currentX = positions.getX(i);
                    const currentY = positions.getY(i);
                    const currentZ = positions.getZ(i);

                    // Gentle suction to center
                    positions.setX(i, THREE.MathUtils.lerp(currentX, currentX * 0.9, gatherProgress * 0.1));
                    positions.setY(i, THREE.MathUtils.lerp(currentY, currentY * 0.9, gatherProgress * 0.1));
                    positions.setZ(i, THREE.MathUtils.lerp(currentZ, 0, gatherProgress * 0.05));
                } else {
                    // Drift
                    const ix = i * 3;
                    // positions.setX(i, positions.getX(i) + Math.sin(time + ix) * 0.001);
                }
            }
            positions.needsUpdate = true;

            // Fade out particles as surface appears
            (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.8 * (1 - gatherProgress);
        }

        // Surface Appearance
        if (tissueRef.current) {
            const surfaceProgress = THREE.MathUtils.smoothstep(time, 3.0, 5.0);
            const mat = tissueRef.current.material as THREE.MeshPhysicalMaterial;
            mat.opacity = surfaceProgress;

            // Gentle wave on surface (like a breath)
            const geo = tissueRef.current.geometry;
            const pos = geo.attributes.position;
            // Optimization: Don't animate full high-res plane every frame if possible. 
            // But for "breathing" effect we might need vertex shader or just minimal update.
            // Let's stick to simple displacement map logic or skip geom update for performance if dense.
            // Actually, just subtle rotation/float is enough for "Breathing"
            tissueRef.current.rotation.x = -Math.PI / 6 + Math.sin(time * 0.5) * 0.02;
        }

        // Text Embossing
        if (textRef.current) {
            const embossStart = 4.0;
            const embossEnd = 6.0;
            const embossProgress = THREE.MathUtils.smoothstep(time, embossStart, embossEnd);

            // Move from inside the mesh (z = -0.1) to just protruding (z = 0.05)
            textRef.current.position.z = THREE.MathUtils.lerp(-0.5, 0.2, embossProgress);
            textRef.current.position.y = 0; // Centered

            // Also fade in contrast color for the text so it's readable
            const child = textRef.current.children[0] as any;
            if (child && child.material) {
                child.material.opacity = embossProgress;
                // Lerp color from white to slight grey for "shadow" look?
                // Actually let's keep it white but rely on shadows.
            }
        }

        if (time > duration + 1) {
            onComplete();
        }
    });

    return (
        <>
            <color attach="background" args={['#fdfbf7']} /> {/* Soft Ivory Background */}

            {/* Stronger Shadows Setup */}
            <ambientLight intensity={0.6} color="#ffffff" />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                color="#fff5e6" // Warm light
                castShadow
                shadow-bias={-0.0001}
            />
            <spotLight position={[-5, 5, 2]} intensity={0.8} angle={1} penumbra={1} color="#e6f0ff" /> // Cool fill
            <Environment preset="studio" blur={1} />

            {/* Particles (Fibers) */}
            <points ref={particlesRef} geometry={particleGeo} material={particleMaterial} />

            {/* The Tissue Surface */}
            <mesh ref={tissueRef} geometry={tissueGeometry} material={tissueMaterial} position={[0, -1, 0]} rotation={[-Math.PI / 6, 0, 0]} receiveShadow castShadow />

            {/* The Embossed Brand (Part of the same physical material theory) */}
            <group ref={textRef} position={[0, 0, -0.5]} rotation={[-Math.PI / 6, 0, 0]}>
                <Text
                    font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZs.woff" // Inter Thin
                    fontSize={1.2}
                    letterSpacing={0.1}
                    lineHeight={1}
                    anchorX="center"
                    anchorY="middle"
                >
                    Hanky Tales
                    <meshStandardMaterial
                        attach="material"
                        color="#e5e5e5" // Slightly darker than tissue to be visible
                        roughness={0.5}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0}
                    />
                </Text>
            </group>
        </>
    );
}
