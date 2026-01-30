'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const hRef = useRef<THREE.Group>(null);
    const nameRef = useRef<THREE.Group>(null);
    const wrapperRef = useRef<THREE.Mesh>(null);

    // Font URL - Using a cleaner bold font
    const fontUrl = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

    const textMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#E50914", // Netflix Red
        roughness: 0.2, // Glossy
        metalness: 0.1,
        clearcoat: 1.0, // Shiny plastic/glass look
        clearcoatRoughness: 0.1,
        emissive: "#500000",
        emissiveIntensity: 0.2,
    }), []);

    const wrapperMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.6,
        metalness: 0.1,
        transmission: 0.4,
        thickness: 1.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        sheen: 1.0,
        sheenColor: new THREE.Color("#ffffff"),
    }), []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 7.0;

        // --- PHASE 1: THE "H" ZOOM (0s - 2.0s) ---
        if (hRef.current) {
            if (time < 2.0) {
                // Cinematic Zoom: Start VERY close to the H (Z=4) so it fills screen, then pull back to Z=0
                const t = Math.pow(Math.min(time / 2.0, 1), 2);
                // Position: Start from inside the H?
                hRef.current.position.z = THREE.MathUtils.lerp(8, 0, t);

                // Rotation: Slight tilt to straight
                hRef.current.rotation.y = THREE.MathUtils.lerp(-Math.PI / 6, 0, t);
                hRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 12, 0, t);
            } else {
                hRef.current.position.z = 0;
                hRef.current.rotation.set(0, 0, 0);
            }
        }

        // --- PHASE 2: NAME REVEAL (2.0s - 3.0s) ---
        if (nameRef.current) {
            if (time > 1.8) {
                nameRef.current.visible = true;
                // Slide out smoothly
                const t = THREE.MathUtils.smoothstep(time, 1.8, 2.8);
                nameRef.current.position.x = THREE.MathUtils.lerp(-1.5, 1.1, t); // Slide from behind H to right

                // Fade in scale
                const s = THREE.MathUtils.smoothstep(time, 1.8, 2.5);
                nameRef.current.scale.set(s, s, s);
            } else {
                nameRef.current.visible = false;
            }
        }

        // --- PHASE 3: THE TISSUE WRAP (3.0s - 5.0s) ---
        if (wrapperRef.current) {
            const mat = wrapperRef.current.material as THREE.MeshPhysicalMaterial;

            if (time > 3.0) {
                // Fade in
                mat.opacity = THREE.MathUtils.smoothstep(time, 3.0, 3.5) * 0.9;

                const wrapT = THREE.MathUtils.smoothstep(time, 3.0, 5.0);

                // The "Wrapping" motion:
                // A large silk sheet starts huge and shrinks/folds onto the text

                const scale = THREE.MathUtils.lerp(15, 6, wrapT); // Shrink to fit text width
                const yScale = THREE.MathUtils.lerp(15, 1.5, wrapT); // Vertical shrink
                wrapperRef.current.scale.set(scale, yScale, 1);

                // Rotate to "Wrap"
                wrapperRef.current.rotation.z = THREE.MathUtils.lerp(Math.PI / 2, 0, wrapT); // Spin wrap

                // Move closer
                wrapperRef.current.position.z = THREE.MathUtils.lerp(5, 0.5, wrapT); // Press onto text
            }
        }

        if (time > duration) {
            onComplete();
        }
    });

    return (
        <>
            <color attach="background" args={['#000000']} />

            {/* Cinematic Lighting: High Contrast */}
            <ambientLight intensity={0.2} />
            {/* Key Light (Red Rim) */}
            <spotLight position={[5, 5, 5]} intensity={50} color="#ffcccc" angle={0.5} penumbra={1} castShadow />
            {/* Fill Light (Blueish dark) */}
            <pointLight position={[-5, -5, 5]} intensity={10} color="#1a1a2e" />
            {/* Backlight (Silhouette) */}
            <spotLight position={[0, 5, -5]} intensity={50} color="#ffffff" angle={1} />

            <Center position={[0, 0, 0]} onCentered={(data) => {
                // Adjust center manually if needed
            }}>
                <group>
                    {/* THE "H" */}
                    <group ref={hRef}>
                        <Text3D
                            font={fontUrl}
                            size={1.5}
                            height={0.5} // Thicker 3D
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.05} // Nicer bevel
                            bevelSize={0.03}
                            bevelOffset={0}
                            bevelSegments={5}
                            material={textMaterial}
                            position={[-2.5, 0, 0]}
                        >
                            H
                        </Text3D>
                    </group>

                    {/* THE REST: "anky Tales" */}
                    <group ref={nameRef} position={[1.1, 0, 0]} visible={false}>
                        <Text3D
                            font={fontUrl}
                            size={1.5}
                            height={0.5}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.05}
                            bevelSize={0.03}
                            bevelOffset={0}
                            bevelSegments={5}
                            material={textMaterial}
                            position={[-2.5, 0, 0]} // Relative to group
                        >
                            anky Tales
                        </Text3D>
                    </group>
                </group>
            </Center>

            {/* THE TISSUE WRAPPER */}
            <mesh ref={wrapperRef} position={[0, 0, 10]} material={wrapperMaterial} renderOrder={1}>
                <planeGeometry args={[1, 1, 64, 64]} />
            </mesh>
        </>
    );
}
