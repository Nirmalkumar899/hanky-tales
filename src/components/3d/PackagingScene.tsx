'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCard({ position, rotation, textureUrl, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], textureUrl: string, scale?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    const texture = useMemo(() => {
        if (!textureUrl) return null;
        return new THREE.TextureLoader().load(textureUrl);
    }, [textureUrl]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
                <boxGeometry args={[1.5, 1.5, 0.1]} />
                <meshStandardMaterial
                    map={texture || undefined}
                    color={texture ? "white" : "#e2e8f0"}
                    roughness={0.7}
                />
            </mesh>
        </Float>
    );
}

export function PackagingScene() {
    const items = [
        { pos: [0, 0.5, 0], rot: [0.1, 0, 0], img: "/pack_collection_set.png", scale: 1.5 }, // Centerpiece
        { pos: [-2, -1, -1], rot: [0, 0.2, 0.1], img: "/pack_paper_bag_handle.png", scale: 1.2 },
        { pos: [2, 1, -2], rot: [0.1, -0.2, 0], img: "/pack_paper_cup.png", scale: 1 },
        { pos: [-1.5, 1.5, -2], rot: [0.2, 0.1, 0], img: "/pack_burger_box.png", scale: 1 },
        { pos: [1.8, -1.2, -1], rot: [-0.1, 0.2, 0], img: "/pack_fries_tray.png", scale: 1 },
    ] as const;

    return (
        <group>
            <ambientLight intensity={0.8} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <Environment preset="studio" />

            {items.map((item, i) => (
                <FloatingCard
                    key={i}
                    position={item.pos as any}
                    rotation={item.rot as any}
                    textureUrl={item.img}
                    scale={item.scale}
                />
            ))}
        </group>
    );
}
