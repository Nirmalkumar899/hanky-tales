'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Instances, Instance, Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

export function IntroScene({ onComplete }: { onComplete: () => void }) {
    const boxRef = useRef<THREE.Group>(null);
    const tunnelRef = useRef<THREE.Mesh>(null);

    // --- MATERIALS ---
    const neonTextMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: "#00ffff", // Cyan Neon
        toneMapped: false,
    }), []);

    const boxMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#000000",
        roughness: 0.1,
        metalness: 0.9,
        envMapIntensity: 2,
    }), []);

    const holoMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.0,
        metalness: 0.2,
        transmission: 0.6,
        thickness: 1.0,
        iridescence: 1.0,
        iridescenceIOR: 1.3,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
    }), []);

    const silkMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#ff00ff", // Magenta Silk
        roughness: 0.4,
        metalness: 0.5,
        clearcoat: 0.5,
        sheen: 1.0,
        sheenColor: new THREE.Color("#00ffff"),
        side: THREE.DoubleSide,
    }), []);

    // --- INFINITY LOOP DATA ---
    const particleCount = 60;
    const positions = useMemo(() => {
        // Create a Figure-8 Loop path
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 2, -2),
            new THREE.Vector3(6, 0, 0),
            new THREE.Vector3(3, -2, 2),
            new THREE.Vector3(0, 0, 0), // Center (Box)
            new THREE.Vector3(-3, 2, -2),
            new THREE.Vector3(-6, 0, 0),
            new THREE.Vector3(-3, -2, 2),
        ], true);

        return new Array(particleCount).fill(0).map((_, i) => {
            const t = i / particleCount;
            return {
                tOffset: t,
                speed: 0.1 + Math.random() * 0.05,
                path: curve
            };
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const duration = 10.0;

        if (tunnelRef.current) {
            tunnelRef.current.rotation.z = time * 0.1;
        }

        if (time > duration) {
            onComplete();
        }
    });

    return (
        <>
            <color attach="background" args={['#050011']} /> {/* Deep Purple Void */}
            <fog attach="fog" args={['#050011', 5, 25]} />

            {/* --- LIGHTING (Neon Cyberpunk) --- */}
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={5} color="#00ffff" distance={5} /> {/* Core Glow */}
            <spotLight position={[5, 5, 5]} intensity={20} color="#ff00ff" angle={0.5} penumbra={0.5} />
            <spotLight position={[-5, -5, 5]} intensity={20} color="#00ffff" angle={0.5} penumbra={0.5} />
            <Environment preset="city" />

            {/* --- THE PORTAL BOX (Monolith) --- */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group ref={boxRef}>
                    <mesh material={boxMaterial}>
                        <boxGeometry args={[2, 2, 2]} />
                    </mesh>
                    {/* Neon Text on sides */}
                    <Text
                        position={[0, 0, 1.01]}
                        fontSize={0.15}
                        color="#00ffff"
                        material={neonTextMaterial}
                        maxWidth={1.8}
                        textAlign="center"
                    >
                        GOT AN ISSUE
                    </Text>
                    <Text
                        position={[0, 0, -1.01]}
                        rotation={[0, Math.PI, 0]}
                        fontSize={0.15}
                        color="#ff00ff"
                        material={neonTextMaterial}
                        maxWidth={1.8}
                        textAlign="center"
                    >
                        GET A TISSUE
                    </Text>

                    {/* Inner Portal Glow (Sphere inside) */}
                    <mesh>
                        <sphereGeometry args={[0.8, 32, 32]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </group>
            </Float>

            {/* --- INFINITY LOOP PARTICLES --- */}
            {/* 1. Impossible DNA (Torus Knots) */}
            <Instances range={20} material={holoMaterial} geometry={new THREE.TorusKnotGeometry(0.15, 0.05, 64, 8)}>
                {positions.slice(0, 20).map((data, i) => (
                    <LoopParticle key={i} data={data} type="dna" />
                ))}
            </Instances>

            {/* 2. Origami Cranes (Stylized Cones) */}
            <Instances range={20} material={silkMaterial} geometry={new THREE.ConeGeometry(0.2, 0.5, 4)}>
                {positions.slice(20, 40).map((data, i) => (
                    <LoopParticle key={i} data={data} type="origami" />
                ))}
            </Instances>

            {/* --- ENVIRONMENT --- */}
            {/* Vortex Tunnel */}
            <mesh ref={tunnelRef} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[10, 10, 40, 32, 1, true]} />
                <meshBasicMaterial color="#220033" wireframe side={THREE.BackSide} transparent opacity={0.1} />
            </mesh>

            {/* Crystal Tears (Floating Spheres) */}
            <Instances range={15} material={holoMaterial} geometry={new THREE.SphereGeometry(0.3, 32, 32)}>
                {new Array(15).fill(0).map((_, i) => (
                    <Float key={i} speed={0.5} rotationIntensity={1} floatIntensity={2} position={[
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 5 - 5
                    ]}>
                        <Instance scale={0.5 + Math.random()} />
                    </Float>
                ))}
            </Instances>

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        </>
    );
}

function LoopParticle({ data, type }: { data: any, type: string }) {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const t = (time * data.speed + data.tOffset) % 1;

        if (ref.current) {
            const pos = data.path.getPointAt(t);
            const tangent = data.path.getTangentAt(t);

            ref.current.position.copy(pos);
            ref.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

            // Animation: Scale Up when far, Shrink when enters box (Box is at 0,0,0)
            const dist = pos.length();
            // dist 0 (center) -> scale 0.1
            // dist 6 (far) -> scale 1.5
            const s = THREE.MathUtils.lerp(0.1, 1.5, Math.min(dist / 4, 1));

            ref.current.scale.setScalar(s);

            // Extra rotation
            ref.current.rotation.x += 0.05;
            ref.current.rotation.z += 0.05;
        }
    });
    return <Instance ref={ref} />;
}
