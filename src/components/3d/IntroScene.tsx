'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const hRef = useRef<THREE.Group>(null);
    const nameRef = useRef<THREE.Group>(null);
    const wrapperRef = useRef<THREE.Mesh>(null);

    // Font URL
    const fontUrl = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

    const textMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#D81F26", // Netflix Red
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        emissive: "#400000",
        emissiveIntensity: 0.1,
    }), []);

    const wrapperMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.5,
        metalness: 0.1,
        transmission: 0.6,
        thickness: 1.5,
        side: THREE.DoubleSide,
        transparent: true, // Key for soft look
        opacity: 0,
        clearcoat: 0.5,
    }), []);

    // Tissue Geometry for wave animation
    const wrapperGeo = useMemo(() => new THREE.PlaneGeometry(12, 6, 64, 64), []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 7.0;

        // --- PHASE 1: THE "H" CENTERED ZOOM (0s - 2.0s) ---
        if (hRef.current) {
            // Position X Logic:
            // 0s-2s: Center (0)
            // 2s-3s: Slide to Left (-3.5) for text "anky Tales" to fit
            const slideStart = 2.0;
            const slideEnd = 3.0;
            const slideT = THREE.MathUtils.smoothstep(time, slideStart, slideEnd);
            hRef.current.position.x = THREE.MathUtils.lerp(0, -3.5, slideT);

            if (time < 2.0) {
                // Intro Zoom Zoom
                const t = Math.pow(Math.min(time / 2.0, 1), 2);
                // Pull back camera effect by moving object Z
                hRef.current.position.z = THREE.MathUtils.lerp(10, 0, t);
            } else {
                // Stay at Z=0
                hRef.current.position.z = 0;
            }
        }

        // --- PHASE 2: NAME REVEAL (2.5s - 3.5s) ---
        if (nameRef.current) {
            // Name needs to separate from the "H" or fade in?
            // User said: "whole name comes"
            // Let's have it scale up and slide out from the H pivot

            if (time > 2.2) {
                nameRef.current.visible = true;
                const t = THREE.MathUtils.smoothstep(time, 2.2, 3.2);

                // Slide: It is attached to H group or separate? Separate.
                // H moves to -3.5. Name needs to end up next to it.
                // "H" width is approx 1.5. Spacing 0.2. Name starts at -3.5 + 1.5 + 0.2 = -1.8?
                // Let's rely on manual tuning for layout.
                // Final X for Name: -1.8

                // Start X: 0 (Behind H) -> End X: -1.8? No, H moves Left, Name appears Right.
                // Let's keep Name centered at 0 initially (hidden), then as H moves Left, Name stays or shifts slightly Right?
                // Actually, simplest is: H moves Left, Name Scales Up at roughly Center/Right.

                const finalNameX = -1.5; // Visual tweak
                const startNameX = -3.5; // Behind H

                nameRef.current.position.x = THREE.MathUtils.lerp(startNameX, finalNameX, t);

                // Scale up
                nameRef.current.scale.set(t, t, t);

                // Opacity/Fade if possible (requires material clone or custom shader, skipping for now, scale is good)
            } else {
                nameRef.current.visible = false;
            }
        }

        // --- PHASE 3: THE TISSUE FLIES (3.5s - 5.5s) ---
        if (wrapperRef.current) {
            const mat = wrapperRef.current.material as THREE.MeshPhysicalMaterial;

            const flyStart = 3.5;
            const flyEnd = 5.0;

            if (time > flyStart) {
                mat.opacity = THREE.MathUtils.lerp(0, 0.9, Math.min((time - flyStart) * 2, 1));

                const t = THREE.MathUtils.smoothstep(time, flyStart, flyEnd);

                // Motion: Fly from Top-Right (5, 5, 2) to Center (0, 0, 0.5)
                wrapperRef.current.position.x = THREE.MathUtils.lerp(10, 0, t);
                wrapperRef.current.position.y = THREE.MathUtils.lerp(5, 0, t);
                wrapperRef.current.position.z = THREE.MathUtils.lerp(5, 0.1, t); // Land on text

                // Rotation: Swing into place
                wrapperRef.current.rotation.z = THREE.MathUtils.lerp(Math.PI / 4, 0, t);
                wrapperRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 4, 0, t);

                // WAVE ANIMATION
                const positions = wrapperGeo.attributes.position;
                for (let i = 0; i < positions.count; i++) {
                    // Simple sine wave flowing across
                    const x = positions.getX(i);
                    const y = positions.getY(i);
                    // Dampen wave as it lands (t=1)
                    const waveAmp = (1 - t) * 0.5;
                    const zOffset = Math.sin(x * 2 + time * 5) * Math.cos(y * 1) * waveAmp;
                    // positions.setZ(i, zOffset); // This flattens plane too much?
                    // Let's set Z relative to plane.
                }
                // wrapperGeo.computeVertexNormals(); // Expensive per frame?
                // Just use simple rotation/scale for performance if vertex noise is buggy.

                // Scale: Start huge, shrink to fit
                const s = THREE.MathUtils.lerp(1.5, 1, t);
                wrapperRef.current.scale.set(s, s, s);
            }
        }

        if (time > duration) {
            onComplete();
        }
    });

    return (
        <>
            <color attach="background" args={['#050505']} /> { /* Deep Dark */}

            {/* Lighting Setup */}
            <ambientLight intensity={0.4} />
            <spotLight position={[5, 5, 10]} angle={0.3} penumbra={1} intensity={10} color="#fff" castShadow />
            <pointLight position={[-5, 0, 5]} intensity={5} color="#ff0000" distance={20} /> {/* Red glow */}

            <Center onCentered={() => { }}>
                <group>
                    {/* THE "H" */}
                    <group ref={hRef}>
                        <Text3D
                            font={fontUrl}
                            size={2.5} // Bigger H
                            height={0.2}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.02}
                            bevelSize={0.02}
                            bevelOffset={0}
                            bevelSegments={5}
                            material={textMaterial}
                        >
                            H
                            <meshStandardMaterial attach="material-0" color="#D81F26" roughness={0.1} /> {/* Face */}
                            <meshStandardMaterial attach="material-1" color="#800000" roughness={0.1} /> {/* Extrusion darkening */}
                        </Text3D>
                    </group>

                    {/* THE NAME */}
                    <group ref={nameRef} visible={false}>
                        <Text3D
                            font={fontUrl}
                            size={2.5}
                            height={0.2}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.02}
                            bevelSize={0.02}
                            bevelOffset={0}
                            bevelSegments={5}
                            material={textMaterial}
                        >
                            anky Tales
                            <meshStandardMaterial attach="material-0" color="#D81F26" roughness={0.1} />
                            <meshStandardMaterial attach="material-1" color="#800000" roughness={0.1} />
                        </Text3D>
                    </group>
                </group>
            </Center>

            {/* FLYING TISSUE */}
            <mesh ref={wrapperRef} geometry={wrapperGeo} material={wrapperMaterial} position={[10, 5, 5]} />
        </>
    );
}
