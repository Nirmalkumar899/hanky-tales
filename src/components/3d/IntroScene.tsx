'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const hRef = useRef<THREE.Group>(null);
    const nameRef = useRef<THREE.Group>(null);
    const wrapperRef = useRef<THREE.Mesh>(null);

    // Font URL for Text3D
    const fontUrl = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

    const textMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ff3333", // Netflix Redish? Or Brand Color? Let's use a Premium Red -> then wrap in white.
        // Actually user said "tissue wraps the name". Let's make text Red so the white tissue contrast is visible.
        roughness: 0.4,
        metalness: 0.1,
    }), []);

    const wrapperMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.8,
        metalness: 0.0,
        transmission: 0.5, // Semi-transparent tissue
        thickness: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
    }), []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 6.0;

        // --- PHASE 1: THE "H" ZOOM (0s - 1.5s) ---
        if (hRef.current) {
            if (time < 1.5) {
                // Zoom out effect: Start close (Z=10) -> End (Z=0)
                const t = Math.pow(time / 1.5, 3); // Cubic ease for "Whoosh"
                hRef.current.position.z = THREE.MathUtils.lerp(15, 0, t);

                // Subtle rotation
                hRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI / 4, 0, t);
            } else {
                hRef.current.position.z = 0;
                hRef.current.rotation.y = 0;
            }
        }

        // --- PHASE 2: NAME EXPANSION (1.5s - 2.5s) ---
        if (nameRef.current) {
            if (time > 1.2) {
                nameRef.current.visible = true;
                // Slide out from behind H? Or just appear?
                // Netflix style: The rest of letters fade/scale in
                const t = THREE.MathUtils.smoothstep(time, 1.2, 2.0);
                nameRef.current.scale.set(t, 1, 1);
                nameRef.current.position.x = THREE.MathUtils.lerp(-1, 0.8, t); // Slide right
            } else {
                nameRef.current.visible = false;
            }
        }

        // --- PHASE 3: THE WRAP (2.5s - 4.5s) ---
        if (wrapperRef.current) {
            const mat = wrapperRef.current.material as THREE.MeshPhysicalMaterial;

            if (time > 2.5) {
                // Appear
                mat.opacity = THREE.MathUtils.smoothstep(time, 2.5, 3.0);

                // Animate wrapping
                const wrapT = THREE.MathUtils.smoothstep(time, 2.5, 4.0);

                // Scale plane down to "Fit" the text
                wrapperRef.current.scale.set(
                    THREE.MathUtils.lerp(5, 1.2, wrapT),
                    THREE.MathUtils.lerp(5, 0.5, wrapT),
                    1
                );

                // Rotation twist
                wrapperRef.current.rotation.z = THREE.MathUtils.lerp(Math.PI, 0, wrapT);

                // "Tighten" position
                wrapperRef.current.position.z = THREE.MathUtils.lerp(5, 0.2, wrapT);

            }
        }

        if (time > duration) {
            onComplete();
        }
    });

    return (
        <>
            {/* Cinematic Studio Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={2} />
            <spotLight position={[-5, 0, 10]} angle={0.5} penumbra={1} intensity={10} color="#ffffff" />

            <Center position={[0, 0, 0]}>
                {/* THE "H" */}
                <group ref={hRef}>
                    <Text3D
                        font={fontUrl}
                        size={1.5}
                        height={0.2}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.02}
                        bevelSize={0.02}
                        bevelOffset={0}
                        bevelSegments={5}
                        material={textMaterial}
                        position={[-2.5, 0, 0]} // Offset to left so "H" centers roughly
                    >
                        H
                    </Text3D>
                </group>

                {/* THE REST: "anky Tales" */}
                <group ref={nameRef} position={[0.8, 0, 0]} visible={false}>
                    <Text3D
                        font={fontUrl}
                        size={1.5}
                        height={0.2}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.02}
                        bevelSize={0.02}
                        bevelOffset={0}
                        bevelSegments={5}
                        material={textMaterial}
                        position={[-2.5 + 1.2, 0, 0]} // Position relative to H
                    >
                        anky Tales
                    </Text3D>
                </group>
            </Center>

            {/* THE TISSUE WRAPPER */}
            <mesh ref={wrapperRef} position={[0, 0, 5]} material={wrapperMaterial}>
                {/* A large plane that shrinks to wrap */}
                <planeGeometry args={[10, 5, 32, 32]} />
            </mesh>
        </>
    );
}
