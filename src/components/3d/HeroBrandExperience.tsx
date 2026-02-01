'use client';

import { Text, Float, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Group, Vector3 } from 'three';
import * as THREE from 'three';

export function HeroBrandExperience() {
    const { viewport } = useThree();
    const groupRef = useRef<Group>(null);

    // Responsive scaling
    const isMobile = viewport.width < 5;
    const textScale = isMobile ? 0.8 : 1.5;

    return (
        <group ref={groupRef}>

            {/* 1. Central Hero Text */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text
                    font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff"
                    fontSize={textScale}
                    letterSpacing={-0.05}
                    color="#D4A373" // Gold/Bronze
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0, 0]}
                >
                    Hanky Tales
                    <meshStandardMaterial color="#D4A373" roughness={0.3} metalness={0.8} />
                </Text>
            </Float>

            {/* 2. Floating Silk Elements - "Softness" */}
            {/* Large background silk */}
            <mesh position={[0, 0, -2]} scale={[10, 10, 1]}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color="#fdfcf0" // Off-white/Cream
                    roughness={0.4}
                    metalness={0.1}
                    distort={0.4}
                    speed={1.5}
                />
            </mesh>

            {/* Floating accents */}
            <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                <mesh position={[-4, 2, -1]} scale={1.5}>
                    <torusGeometry args={[0.5, 0.2, 16, 32]} />
                    <meshStandardMaterial color="#D4A373" roughness={0.2} metalness={1} />
                </mesh>
            </Float>

            <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5} position={[4, -2, 0]}>
                <mesh scale={1.2}>
                    <icosahedronGeometry args={[0.8, 0]} />
                    <MeshDistortMaterial
                        color="#E76F51" // Brand accent
                        roughness={0.2}
                        metalness={0.5}
                        distort={0.6}
                        speed={3}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            </Float>

            {/* 3. Atmosphere */}
            <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} color="#D4A373" />
            <Environment preset="studio" />
        </group>
    );
}
