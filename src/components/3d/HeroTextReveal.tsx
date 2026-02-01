'use client';

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Group, Mesh } from 'three';
import * as THREE from 'three';

export function HeroTextReveal() {
    const groupRef = useRef<Group>(null);
    const textRef = useRef<Group>(null);
    const boxGroupRef = useRef<Group>(null);

    // Animation state
    const [animating, setAnimating] = useState(true);

    useFrame((state, delta) => {
        if (!boxGroupRef.current || !textRef.current) return;

        const time = state.clock.getElapsedTime();
        const duration = 2.5;
        const progress = Math.min(time / duration, 1);

        const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
        const t = ease(progress);

        // Box Animation: 
        // Start combined in center, then rotate and shrink vertical scale to reveal text behind?
        // Actually user want "black squares to hanky tales".
        // Let's have two huge blocks that slide apart or rotate away.

        // Let's rotate them 90 deg to show "thin" side and scale down Y.
        boxGroupRef.current.rotation.x = t * Math.PI * 0.5;

        const boxScaleY = 1 - t;
        // Scale Y to 0
        boxGroupRef.current.scale.set(1, Math.max(boxScaleY, 0.001), 1);

        // Text Animation:
        textRef.current.scale.set(1, 1, 1);
        // Fade in via position or scale if needed, but if boxes cover it, it's fine.
        // Let's float it up slightly
        textRef.current.position.y = (1 - t) * -0.5;

        // Opacity hack: Move boxes far away at end
        if (progress >= 0.95) {
            boxGroupRef.current.position.z = -100;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* The Text Object - centered */}
            <group ref={textRef}>
                <Text
                    position={[0, 0, 0]}
                    fontSize={2.5} // Larger font
                    color="#2C3E50"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff"
                >
                    Hanky Tales
                </Text>
            </group>

            {/* The Black Squares (Covers) */}
            <group ref={boxGroupRef} position={[0, 0, 1]}> {/* Slightly in front of text */}
                {/* Left Block */}
                <mesh position={[-2.6, 0, 0]}>
                    <boxGeometry args={[5, 4, 1]} /> {/* Huge blocks */}
                    <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.1} />
                </mesh>
                {/* Right Block */}
                <mesh position={[2.6, 0, 0]}>
                    <boxGeometry args={[5, 4, 1]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.1} />
                </mesh>
            </group>
        </group>
    );
}
