'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, Plane, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const issueRef = useRef<THREE.Mesh>(null);
    const tissueRef = useRef<THREE.Mesh>(null);
    const happyRef = useRef<THREE.Mesh>(null);

    // Animation State
    // 0s - 2s: Issue Vibration
    // 2s - 3s: Tissue Swoop & Wrap
    // 3s - 5s: Transformation (Happy Ball + Confetti)

    // --- MATERIALS ---
    const issueMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ff3333", // Angry Red
        roughness: 0.6,
        metalness: 0.1,
        flatShading: true,
    }), []);

    const tissueMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.8,
        metalness: 0.0,
        clearcoat: 0.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0, // Starts invisible
    }), []);

    const happyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ffd700", // Gold/Happy Yellow
        roughness: 0.2,
        metalness: 0.3,
        emissive: "#ffaa00",
        emissiveIntensity: 0.2,
    }), []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 5.5;

        // --- PHASE 1: THE ISSUE (0s - 3s) ---
        if (issueRef.current) {
            if (time < 3.0) {
                // Vibrate angrily
                issueRef.current.position.x = Math.sin(time * 50) * 0.05;
                issueRef.current.position.y = Math.cos(time * 40) * 0.05;
                issueRef.current.rotation.z = Math.sin(time * 20) * 0.1;

                // Pulse scale
                const pulse = 1 + Math.sin(time * 10) * 0.1;
                issueRef.current.scale.setScalar(pulse);

                // Spikes (simple rotation to show jagged edges)
                issueRef.current.rotation.x += 0.05;
                issueRef.current.rotation.y += 0.08;
            } else {
                // Shrink and disappear
                issueRef.current.scale.setScalar(Math.max(0, 1 - (time - 3.0) * 5));
                issueRef.current.visible = time < 3.2;
            }
        }

        // --- PHASE 2: THE TISSUE HERO (1.5s - 3.5s) ---
        if (tissueRef.current) {
            const mat = tissueRef.current.material as THREE.MeshPhysicalMaterial;

            if (time > 1.5 && time < 3.5) {
                mat.opacity = 1;
                // Swoop in from top right
                const t = THREE.MathUtils.smoothstep(time, 1.5, 3.0);

                // Position: Start (5, 5, 2) -> Target (0, 0, 0.5)
                tissueRef.current.position.set(
                    THREE.MathUtils.lerp(5, 0, t),
                    THREE.MathUtils.lerp(5, 0, t),
                    THREE.MathUtils.lerp(2, 0.5, t)
                );

                // Wrap animation (Bend geometry? Or just rotate violently to simulate wrapping)
                tissueRef.current.rotation.z = time * 5;
                tissueRef.current.rotation.x = time * 3;
                tissueRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.2, t)); // Shrink as it wraps

                // Fade out after wrap
                if (time > 3.0) mat.opacity = 1 - (time - 3.0) * 2;

            } else if (time > 3.5) {
                tissueRef.current.visible = false;
            }
        }

        // --- PHASE 3: HAPPY RESOLUTION (3.0s+) ---
        if (happyRef.current) {
            if (time > 3.0) {
                happyRef.current.visible = true;

                // Pop out! (Bounce scale)
                const t = Math.min((time - 3.0) * 3, 1);
                // Elastic bounce
                const elastic = (x: number) => {
                    const c4 = (2 * Math.PI) / 3;
                    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
                };
                const scale = elastic(t) * 1.5;
                happyRef.current.scale.setScalar(scale);

                // Gentle float
                happyRef.current.position.y = Math.sin(time * 2) * 0.2;
            } else {
                happyRef.current.visible = false;
            }
        }

        if (time > duration) {
            onComplete();
        }
    });

    return (
        <>
            <color attach="background" args={['#F0F4F8']} /> {/* Neutral Clean Blue-Grey BG */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 5, 2]} intensity={0.5} color="#aaddff" />

            {/* THE ISSUE: Spiky Icosahedron */}
            <mesh ref={issueRef} position={[0, 0, 0]} material={issueMaterial}>
                {/* Detail=0 gives it a low-poly spiky look */}
                <icosahedronGeometry args={[1.2, 0]} />
            </mesh>

            {/* THE TISSUE HERO: Plane */}
            <mesh ref={tissueRef} position={[5, 5, 5]} material={tissueMaterial}>
                <planeGeometry args={[4, 4, 32, 32]} />
            </mesh>

            {/* THE RESOLUTION: Smooth Sphere */}
            <mesh ref={happyRef} position={[0, 0, 0]} visible={false} material={happyMaterial}>
                <sphereGeometry args={[1, 64, 64]} />
            </mesh>

            {/* CONFETTI (Only appearing later) */}
            <Confetti start={3.0} />
        </>
    );
}

function Confetti({ start }: { start: number }) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.visible = time > start;
            if (time > start) {
                // Expand outward
                const t = time - start;
                groupRef.current.scale.setScalar(1 + t * 5);
                groupRef.current.rotation.y += 0.05;
            }
        }
    });

    // Create random particles
    const particles = useMemo(() => {
        return new Array(50).fill(0).map((_, i) => (
            <mesh key={i} position={[
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                <planeGeometry args={[0.1, 0.1]} />
                <meshBasicMaterial color={new THREE.Color().setHSL(Math.random(), 1, 0.5)} side={THREE.DoubleSide} />
            </mesh>
        ))
    }, []);

    return <group ref={groupRef} visible={false}>{particles}</group>;
}
