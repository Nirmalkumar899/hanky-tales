'use client';

import { Canvas } from '@react-three/fiber';
import { IntroScene } from '../3d/IntroScene';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface IntroOverlayProps {
    onIntroComplete: () => void;
}

export function IntroOverlay({ onIntroComplete }: IntroOverlayProps) {
    const [sceneCompleted, setSceneCompleted] = useState(false);
    const [bgClass, setBgClass] = useState("bg-black"); // Start Black

    useEffect(() => {
        // 3.5s: Flash to white (Wrap complete)
        const timer = setTimeout(() => {
            setBgClass("bg-white");
        }, 4500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (sceneCompleted) {
            const timer = setTimeout(() => {
                onIntroComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [sceneCompleted, onIntroComplete]);

    return (
        <AnimatePresence>
            {!sceneCompleted && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.0 }}
                    className={`fixed inset-0 z-50 ${bgClass} transition-colors duration-1000 flex items-center justify-center overflow-hidden`}
                >
                    <div className="w-full h-full relative">
                        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
