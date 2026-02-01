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
        if (!animating || !boxGroupRef.current || !textRef.current) return;

        const time = state.clock.getElapsedTime();
        const duration = 2.5; // Animation duration in seconds
        const progress = Math.min(time / duration, 1);

        // Easing function: easeOutExpo
        const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
        const t = ease(progress);

        // Box Animation: Rotate and Scale down
        // Rotate 180 degrees (PI) and scale width to 0
        boxGroupRef.current.rotation.x = t * Math.PI;
        // Scale down the boxes to reveal text
        const boxScale = 1 - t;
        boxGroupRef.current.scale.set(1, Math.max(boxScale, 0.001), 1);
        boxGroupRef.current.position.y = t * 0.5; // Slight float up

        // Fading out boxes logic (opacity) is trickier with standard materials unless transparent=true
        // We'll rely on scaling and rotation to "hide" them behind the emerging text or just vanish.

        // Text Animation: Scale up
        // Starts invisible or small
        textRef.current.scale.set(1, t, 1);
        textRef.current.rotation.x = (1 - t) * -Math.PI * 0.5; // Rotate up from -90

        if (progress >= 1) {
            setAnimating(false);
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* The Text Object */}
            <group ref={textRef} scale={[1, 0, 1]}>
                <Text
                    position={[0, 0.2, 0]}
                    fontSize={1.5}
                    color="#2C3E50" // Dark text
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff" // Serif font for "Hanky"
                >
                    Hanky Tales
                </Text>
            </group>

            {/* The Black Squares (Covers) */}
            <group ref={boxGroupRef}>
                {/* Two blocks covering the text area roughly */}
                <mesh position={[-2, 0, 0]}>
                    <boxGeometry args={[3, 1.5, 0.5]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[2, 0, 0]}>
                    <boxGeometry args={[3, 1.5, 0.5]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>
        </group>
    );
}
