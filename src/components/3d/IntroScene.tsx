'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Instance, Instances, Environment, Float, Cloud } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const boxRef = useRef<THREE.Group>(null);

    // --- MATERIALS ---
    const boxMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.2, // Glossy box
        metalness: 0.1,
    }), []);

    const tissueMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.8, // Matte Fabric
        metalness: 0.0,
        clearcoat: 0.0,
        sheen: 1.0,
        sheenColor: new THREE.Color("#e0f2fe"), // Baby blue sheen
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
    }), []);

    const waterMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.0,
        metalness: 0.0,
        transmission: 1.0, // Glass/Water
        thickness: 1.0,
        ior: 1.33,
        transparent: true,
    }), []);

    // --- TISSUE EXPLOSION DATA ---
    const tissueCount = 40;
    const tissueData = useMemo(() => {
        return new Array(tissueCount).fill(0).map(() => ({
            dir: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
            speed: 2 + Math.random() * 3,
            rotSpeed: (Math.random() - 0.5) * 5,
            scale: 0.5 + Math.random() * 1.5,
            delay: Math.random() * 0.5
        }));
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 6.0;

        // Animate Box
        if (boxRef.current) {
            // Subtle float
            boxRef.current.position.y = Math.sin(time) * 0.1;
            boxRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
        }

        if (time > duration) {
            onComplete();
        }
    });

    return (
        <>
            {/* Background & Atmosphere - White to Light Blue Gradient via Environment/Color */}
            <color attach="background" args={['#f0f9ff']} /> {/* Very light baby blue/white */}
            <fog attach="fog" args={['#f0f9ff', 5, 20]} />

            {/* Lighting - Cinematic Studio */}
            <ambientLight intensity={0.5} color="#ffffff" />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" castShadow />
            {/* Rim Light for drama */}
            <spotLight position={[-5, 5, -5]} intensity={5} color="#0ea5e9" angle={0.5} penumbra={0.5} />
            {/* Soft Fill */}
            <pointLight position={[0, -5, 2]} intensity={1} color="#e0f2fe" />
            <Environment preset="studio" blur={1} />

            {/* --- THE TISSUE BOX (Centerpiece) --- */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                <group ref={boxRef} position={[0, 0, 0]}>
                    <mesh castShadow receiveShadow material={boxMaterial}>
                        <boxGeometry args={[3, 1.5, 1.5]} /> {/* Landscape box */}
                    </mesh>

                    {/* Text on Front Face */}
                    <Text
                        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZs.woff"
                        fontSize={0.25}
                        color="#0f172a" // Slate-900 text
                        position={[0, 0, 0.76]} // Slightly in front
                        maxWidth={2.8}
                        textAlign="center"
                        letterSpacing={0.05}
                        lineHeight={1.2}
                    >
                        GOT AN ISSUE,
                        GET A TISSUE
                    </Text>

                    {/* Brand Logo small below */}
                    <Text
                        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZs.woff"
                        fontSize={0.1}
                        color="#94a3b8" // Slate-400
                        position={[0, -0.4, 0.76]}
                        letterSpacing={0.1}
                    >
                        HANKY TALES
                    </Text>

                    {/* Opening on Top */}
                    <mesh position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]} material={new THREE.MeshStandardMaterial({ color: "#e2e8f0" })}>
                        <planeGeometry args={[2, 0.8]} />
                    </mesh>
                </group>
            </Float>

            {/* --- EXPLODING TISSUES --- */}
            <Instances range={tissueCount} material={tissueMaterial} geometry={new THREE.PlaneGeometry(1, 1, 16, 16)}>
                {tissueData.map((data, i) => (
                    <ExplodingTissue key={i} data={data} startOrigin={[0, 0.8, 0]} />
                ))}
            </Instances>

            {/* --- LUXURY PARTICLES (Droplets & Sparkles) --- */}
            <Instances range={20} material={waterMaterial} geometry={new THREE.SphereGeometry(0.1, 16, 16)}>
                {new Array(20).fill(0).map((_, i) => (
                    <FloatingParticle key={i} speed={0.5} range={4} />
                ))}
            </Instances>

            {/* Soft Cotton Clouds (Visual Filler) */}
            <Cloud opacity={0.3} speed={0.1} bounds={[10, 2, 2]} segments={10} position={[0, -3, -5]} color="#f0f9ff" />
            <Cloud opacity={0.2} speed={0.1} bounds={[10, 2, 2]} segments={10} position={[3, 2, -3]} color="#ffffff" />

        </>
    );
}

function ExplodingTissue({ data, startOrigin }: { data: any, startOrigin: [number, number, number] }) {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const start = 0.5; // Delay explosion slightly

        if (ref.current && time > start + data.delay) {
            const t = time - (start + data.delay);

            // Move outward spiraling
            ref.current.position.x = startOrigin[0] + data.dir.x * t * data.speed + Math.sin(t * 2) * 0.5;
            ref.current.position.y = startOrigin[1] + data.dir.y * t * data.speed + Math.cos(t * 2) * 0.5;
            ref.current.position.z = startOrigin[2] + data.dir.z * t * data.speed;

            // Rotate cloth-like
            ref.current.rotation.x = t * data.rotSpeed;
            ref.current.rotation.y = t * data.rotSpeed * 0.5;

            // Scale up then flutter
            const s = Math.min(t * 2, 1) * data.scale;
            ref.current.scale.setScalar(s);
        } else if (ref.current) {
            ref.current.scale.setScalar(0);
            ref.current.position.set(...startOrigin);
        }
    });

    return <Instance ref={ref} />;
}

function FloatingParticle({ speed, range }: { speed: number, range: number }) {
    const ref = useRef<THREE.Group>(null);
    const initialPos = useMemo(() => new THREE.Vector3(
        (Math.random() - 0.5) * range,
        (Math.random() - 0.5) * range,
        (Math.random() - 0.5) * range + 2
    ), [range]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.position.y = initialPos.y + Math.sin(t * speed + initialPos.x) * 0.5;
            ref.current.position.x = initialPos.x;
            ref.current.position.z = initialPos.z;
            ref.current.rotation.x += 0.01;
            ref.current.rotation.y += 0.01;
        }
    });
    return <Instance ref={ref} />;
}
