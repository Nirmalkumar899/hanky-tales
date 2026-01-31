'use client';

import { Canvas } from "@react-three/fiber";
import { PackagingScene } from "@/components/3d/PackagingScene";
import { Suspense } from "react";

export function PackagingHero() {
    return (
        <div className="h-[400px] w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--marketing-green)]/10 to-transparent rounded-full blur-3xl"></div>
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <PackagingScene />
                </Suspense>
            </Canvas>
        </div>
    );
}
