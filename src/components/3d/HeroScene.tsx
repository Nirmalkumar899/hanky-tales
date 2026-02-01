'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Html } from '@react-three/drei';
import { FloatingTissue } from './FloatingTissue';
import { MascotCharacter } from './MascotCharacter';
import { HeroTextReveal } from './HeroTextReveal';
import { HeroBrandExperience } from './HeroBrandExperience';
import { Suspense } from 'react';

export function HeroScene() {
    return (
        <div className="w-full h-full relative">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                shadows
                dpr={[1, 2]}
            >
                <Suspense fallback={<Html center><div className="text-[#D4A373] font-serif text-xl tracking-widest uppercase">Loading Luxury...</div></Html>}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4A373" />

                    <HeroBrandExperience />

                    {/* Previous components temporarily disabled
                    <FloatingTissue />
                    <MascotCharacter /> 
                    */}

                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />

                    <Environment preset="city" />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                </Suspense>
            </Canvas>
        </div>
    );
}
