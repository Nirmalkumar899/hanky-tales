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
                    transition={{ duration: 1.5, ease: "easeInOut" }} // Slow, luxurious fade out
                    className="fixed inset-0 z-50 bg-[#fdfbf7] flex items-center justify-center overflow-hidden"
                >
                    <div className="w-full h-full relative">
                        {/* 3D Scene handles visuals and brand text */}
                        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        {/* Just the tagline overlay, appearing late */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 4.5, duration: 1.5 }}
                            className="absolute bottom-12 w-full text-center pointer-events-none"
                        >
                            <p className="text-stone-400 font-light text-sm tracking-[0.4em] uppercase font-sans">
                                Experience Pure Softness
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
